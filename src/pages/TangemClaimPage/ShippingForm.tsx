import { FC, FormEvent, useState } from 'react'

import { Button } from '~/shared/ui'

import {
  ClaimDetails,
  ClaimError,
  ClaimResult,
  confirmEmailVerification,
  maskEmail,
  startEmailVerification,
  submitClaim,
} from './claim'
import { COUNTRIES } from './countries'
import { isMockEnabled, MOCK_CODE } from './mockApi'
import classes from './TangemClaimPage.module.scss'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

type EmailStage = 'idle' | 'sent' | 'verified'
type Phase = 'form' | 'preview'
type FieldErrors = Partial<Record<'fullName' | 'email' | 'country' | 'addressLine1' | 'city' | 'postalCode' | 'telephone' | 'confirmed', string>>

/**
 * Delivery-details form for a verified winning wallet. Two phases: fill the
 * details, then review a formatted address preview before submitting. Collects
 * shipping info, verifies the delivery email via OTP (reusing /email/*) or reuses
 * the registered email one-click, requires a single combined legal confirmation,
 * then POSTs /claim. Authorised by `claimToken`.
 */
export const ShippingForm: FC<{
  claimToken: string
  registeredEmail?: string
  deadlineLabel: string
  closed: boolean
  onSubmitted: (result: ClaimResult, email: string) => void
  onSessionExpired: () => void
}> = ({ claimToken, registeredEmail, deadlineLabel, closed, onSubmitted, onSessionExpired }) => {
  const [phase, setPhase] = useState<Phase>('form')

  const [fullName, setFullName] = useState('')
  const [emailMode, setEmailMode] = useState<'registered' | 'new'>(
    registeredEmail ? 'registered' : 'new',
  )
  const [email, setEmail] = useState('')
  const [emailStage, setEmailStage] = useState<EmailStage>('idle')
  const [code, setCode] = useState('')
  const [country, setCountry] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [telephone, setTelephone] = useState('')

  // One combined legal confirmation (age + lawful receipt + household + rules/privacy).
  const [confirmed, setConfirmed] = useState(false)
  // Address-preview confirmation (correct address + can receive parcels + customs).
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false)

  const [busy, setBusy] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const emailReady = emailMode === 'registered' || emailStage === 'verified'
  const deliveryEmail = emailMode === 'registered' ? registeredEmail ?? '' : email.trim()

  const clearErr = (key: keyof FieldErrors) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const handleSessionError = (err: unknown): boolean => {
    if (err instanceof ClaimError && err.kind === 'expired') {
      onSessionExpired()
      return true
    }
    return false
  }

  // --- Email OTP ---
  const sendCode = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError(null)
    setBusy(true)
    try {
      await startEmailVerification(claimToken, email.trim())
      setEmailStage('sent')
    } catch (err) {
      if (handleSessionError(err)) return
      setEmailError(err instanceof ClaimError ? err.message : 'Could not send the code. Please retry.')
    } finally {
      setBusy(false)
    }
  }

  const confirmCode = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setEmailError('Enter the 6-digit code from your email.')
      return
    }
    setEmailError(null)
    setBusy(true)
    try {
      await confirmEmailVerification(claimToken, email.trim(), code.trim())
      setEmailStage('verified')
      clearErr('email')
    } catch (err) {
      if (handleSessionError(err)) return
      setEmailError(err instanceof ClaimError ? err.message : 'That code is incorrect or expired.')
    } finally {
      setBusy(false)
    }
  }

  const onEmailChange = (value: string) => {
    setEmail(value)
    if (emailError) setEmailError(null)
    if (emailStage !== 'idle') {
      setEmailStage('idle')
      setCode('')
    }
  }

  const switchToNew = () => {
    setEmailMode('new')
    setEmailStage('idle')
    setCode('')
    setEmailError(null)
  }
  const switchToRegistered = () => {
    setEmailMode('registered')
    setEmailStage('idle')
    setEmail('')
    setCode('')
    setEmailError(null)
    clearErr('email')
  }

  // --- Validation: recoverable, per-field ---
  const validate = (): boolean => {
    const errs: FieldErrors = {}
    if (!fullName.trim()) errs.fullName = 'Enter the recipient’s full legal name.'
    if (!emailReady) {
      errs.email = emailMode === 'new'
        ? 'Verify your email — enter it and confirm the 6-digit code.'
        : 'Confirm which email to use.'
    }
    if (!country) errs.country = 'Select a country.'
    if (!addressLine1.trim()) errs.addressLine1 = 'Enter address line 1.'
    if (!city.trim()) errs.city = 'Enter the city or locality.'
    if (!postalCode.trim()) errs.postalCode = 'Enter the postal code.'
    if (!telephone.trim()) errs.telephone = 'Enter a phone number.'
    if (!confirmed) errs.confirmed = 'Please tick the confirmation to continue.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  // The form is long, so switching phase near the bottom would leave the user
  // scrolled past the new heading — bring the scroll container back to the top.
  const scrollToTop = () => {
    const root = document.getElementById('root')
    if (root && root.scrollHeight > root.clientHeight + 4) {
      root.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPreview = (e: FormEvent) => {
    e.preventDefault()
    if (closed) return
    setError(null)
    if (validate()) {
      setPhase('preview')
      scrollToTop()
    }
  }

  const editDetails = () => {
    setDeliveryConfirmed(false)
    setError(null)
    setPhase('form')
    scrollToTop()
  }

  const handleSubmit = async () => {
    if (closed || !deliveryConfirmed || submitting) return
    setError(null)
    setSubmitting(true)
    try {
      const useRegistered = emailMode === 'registered'
      const details: ClaimDetails = {
        fullName: fullName.trim(),
        email: useRegistered ? '' : email.trim(),
        country,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        region: region.trim(),
        postalCode: postalCode.trim(),
        telephone: telephone.trim(),
      }
      const result = await submitClaim(claimToken, details, useRegistered)
      const displayEmail = useRegistered ? registeredEmail ?? '' : maskEmail(email.trim())
      onSubmitted(result, displayEmail)
    } catch (err) {
      if (handleSessionError(err)) return
      setError(err instanceof ClaimError ? err.message : 'Could not submit your claim. Please retry.')
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Address preview ----
  if (phase === 'preview') {
    return (
      <div className={classes.form}>
        <h2 className={classes.formHeading}>Review your delivery details</h2>
        <p className={classes.deadline}>Check everything is correct — this is where your prize ships.</p>

        <div className={classes.previewAddress}>
          <div className={classes.previewName}>{fullName.trim()}</div>
          <div>{addressLine1.trim()}</div>
          {addressLine2.trim() && <div>{addressLine2.trim()}</div>}
          <div>
            {city.trim()}
            {region.trim() ? `, ${region.trim()}` : ''} {postalCode.trim()}
          </div>
          <div>{country}</div>
          <div className={classes.previewMeta}>{telephone.trim()}</div>
          <div className={classes.previewMeta}>{deliveryEmail}</div>
        </div>

        <p className={classes.customsWarn}>
          Customs duties or local taxes may apply on international delivery and are the recipient’s
          responsibility.
        </p>

        <label className={classes.check}>
          <input
            type="checkbox"
            checked={deliveryConfirmed}
            onChange={(e) => setDeliveryConfirmed(e.target.checked)}
            disabled={closed}
          />
          <span>I confirm this address is correct and the recipient can receive parcels here.</span>
        </label>

        {closed && (
          <p className={classes.closedNotice}>The initial claim period closed on {deadlineLabel}.</p>
        )}
        {error && <p className={classes.error}>{error}</p>}

        <div className={classes.previewActions}>
          <button type="button" className={classes.editBtn} onClick={editDetails} disabled={submitting}>
            ← Edit
          </button>
          <Button
            type="button"
            variant="primary"
            className={classes.cta}
            onClick={() => void handleSubmit()}
            disabled={!deliveryConfirmed || submitting || closed}
          >
            {submitting ? 'Submitting…' : 'Confirm & submit'}
          </Button>
        </div>
      </div>
    )
  }

  // ---- Details form ----
  return (
    <form className={classes.form} onSubmit={goToPreview}>
      <h2 className={classes.formHeading}>Claim your Tangem Wallet</h2>
      <p className={classes.deadline}>Submit your delivery details before {deadlineLabel}.</p>

      {closed && <p className={classes.closedNotice}>The initial claim period closed on {deadlineLabel}.</p>}

      <label className={classes.field}>
        <span className={classes.label}>Full legal name <span className={classes.req}>*</span></span>
        <input
          className={`${classes.input} ${fieldErrors.fullName ? classes.inputError : ''}`}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            clearErr('fullName')
          }}
          autoComplete="name"
          disabled={closed}
        />
        {fieldErrors.fullName && <p className={classes.fieldError}>{fieldErrors.fullName}</p>}
      </label>

      {/* Delivery email — one-click reuse of the registered address, or enter + OTP a new one. */}
      <div className={classes.field}>
        <span className={classes.label}>Email address <span className={classes.req}>*</span></span>

        {emailMode === 'registered' ? (
          <>
            <div className={classes.emailRow}>
              <span className={classes.registeredEmail}>{registeredEmail}</span>
              <span className={classes.verifiedTag}>✓ Verified</span>
            </div>
            <p className={classes.hint}>
              Your verified registration email will be used.{' '}
              <button type="button" className={classes.linkInline} onClick={switchToNew} disabled={closed}>
                Use another email
              </button>
            </p>
          </>
        ) : (
          <>
            <div className={classes.emailRow}>
              <input
                className={`${classes.input} ${emailError || fieldErrors.email ? classes.inputError : ''}`}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                disabled={closed || emailStage === 'verified'}
              />
              {emailStage === 'verified' ? (
                <span className={classes.verifiedTag}>✓ Verified</span>
              ) : (
                <button
                  type="button"
                  className={classes.smallBtn}
                  onClick={() => void sendCode()}
                  disabled={busy || closed || !email.trim()}
                >
                  {busy && emailStage === 'idle' ? 'Sending…' : emailStage === 'sent' ? 'Resend' : 'Send code'}
                </button>
              )}
            </div>
            {emailStage === 'sent' && (
              <div className={classes.emailRow}>
                <input
                  className={`${classes.input} ${classes.codeInput} ${emailError ? classes.inputError : ''}`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="xxxxxx"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ''))
                    if (emailError) setEmailError(null)
                  }}
                  disabled={closed}
                />
                <button
                  type="button"
                  className={classes.smallBtn}
                  onClick={() => void confirmCode()}
                  disabled={busy || closed}
                >
                  {busy ? 'Verifying…' : 'Verify'}
                </button>
              </div>
            )}
            {emailStage === 'sent' && isMockEnabled && (
              <p className={classes.hint}>Mock mode — the code is {MOCK_CODE}.</p>
            )}
            {registeredEmail && (
              <p className={classes.hint}>
                <button type="button" className={classes.linkInline} onClick={switchToRegistered} disabled={closed}>
                  Use my registered email ({registeredEmail})
                </button>
              </p>
            )}
          </>
        )}
        {emailError && <p className={classes.fieldError}>{emailError}</p>}
        {!emailError && fieldErrors.email && <p className={classes.fieldError}>{fieldErrors.email}</p>}
      </div>

      <label className={classes.field}>
        <span className={classes.label}>Country <span className={classes.req}>*</span></span>
        <select
          className={`${classes.select} ${fieldErrors.country ? classes.inputError : ''}`}
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            clearErr('country')
          }}
          disabled={closed}
        >
          <option value="" disabled>
            Select a country…
          </option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {fieldErrors.country && <p className={classes.fieldError}>{fieldErrors.country}</p>}
      </label>

      <label className={classes.field}>
        <span className={classes.label}>Address line 1 <span className={classes.req}>*</span></span>
        <input
          className={`${classes.input} ${fieldErrors.addressLine1 ? classes.inputError : ''}`}
          value={addressLine1}
          onChange={(e) => {
            setAddressLine1(e.target.value)
            clearErr('addressLine1')
          }}
          autoComplete="address-line1"
          disabled={closed}
        />
        {fieldErrors.addressLine1 && <p className={classes.fieldError}>{fieldErrors.addressLine1}</p>}
      </label>

      <label className={classes.field}>
        <span className={classes.label}>
          Address line 2 <span className={classes.optional}>— optional</span>
        </span>
        <input
          className={classes.input}
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          autoComplete="address-line2"
          disabled={closed}
        />
      </label>

      <div className={classes.row2}>
        <label className={classes.field}>
          <span className={classes.label}>City / locality <span className={classes.req}>*</span></span>
          <input
            className={`${classes.input} ${fieldErrors.city ? classes.inputError : ''}`}
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              clearErr('city')
            }}
            autoComplete="address-level2"
            disabled={closed}
          />
          {fieldErrors.city && <p className={classes.fieldError}>{fieldErrors.city}</p>}
        </label>
        <label className={classes.field}>
          <span className={classes.label}>
            State / region <span className={classes.optional}>— optional</span>
          </span>
          <input
            className={classes.input}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            autoComplete="address-level1"
            disabled={closed}
          />
        </label>
      </div>

      <div className={classes.row2}>
        <label className={classes.field}>
          <span className={classes.label}>Postal code <span className={classes.req}>*</span></span>
          <input
            className={`${classes.input} ${fieldErrors.postalCode ? classes.inputError : ''}`}
            value={postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value)
              clearErr('postalCode')
            }}
            autoComplete="postal-code"
            disabled={closed}
          />
          {fieldErrors.postalCode && <p className={classes.fieldError}>{fieldErrors.postalCode}</p>}
        </label>
        <label className={classes.field}>
          <span className={classes.label}>Telephone <span className={classes.req}>*</span></span>
          <input
            className={`${classes.input} ${fieldErrors.telephone ? classes.inputError : ''}`}
            type="tel"
            value={telephone}
            onChange={(e) => {
              setTelephone(e.target.value)
              clearErr('telephone')
            }}
            autoComplete="tel"
            disabled={closed}
          />
          {fieldErrors.telephone && <p className={classes.fieldError}>{fieldErrors.telephone}</p>}
        </label>
      </div>

      <label className={`${classes.check} ${classes.checkCombined}`}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => {
            setConfirmed(e.target.checked)
            clearErr('confirmed')
          }}
          disabled={closed}
        />
        <span>
          I confirm I am at least 18 or the age of majority where I live; I can lawfully receive this
          prize and am not subject to applicable sanctions; no other winning wallet in my household is
          claiming a prize; and I accept the Giveaway Rules and Privacy Notice.
        </span>
      </label>
      {fieldErrors.confirmed && <p className={classes.fieldError}>{fieldErrors.confirmed}</p>}

      <Button type="submit" variant="primary" className={classes.cta} disabled={closed}>
        Review address
      </Button>
    </form>
  )
}
