import { FC, FormEvent, useState } from 'react'

import { Button } from '~/shared/ui'

import { ClaimError, confirmEmailVerification, maskEmail, startEmailVerification } from './claim'
import classes from './TangemClaimPage.module.scss'
import { isMockEnabled, MOCK_CODE } from './mockApi'

type Step = 'email' | 'code' | 'done'

// Local part, then @, then a domain with at least one dot and a ≥2-char TLD.
// Rejects e.g. "zwwww@r" (no dot) and "a@b.c" (1-char TLD).
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

/**
 * The "you're registered" success screen. Rendered both right after a successful
 * registration and for a returning wallet that already registered.
 */
export const RegisteredSuccess: FC<{
  deadline?: string
  shortWallet?: string
  maskedEmail?: string
  onRegisterAnother?: () => void
}> = ({ deadline, shortWallet, maskedEmail, onRegisterAnother }) => (
  <div className={classes.formCard}>
    <div className={classes.successHead}>
      <div className={classes.successMark}>✓</div>
      <h2 className={classes.formHeading}>You’re registered!</h2>
    </div>

    {(shortWallet || maskedEmail) && (
      <dl className={classes.confirmed}>
        {shortWallet && (
          <div className={classes.confirmedRow}>
            <dt>Wallet</dt>
            <dd>
              {shortWallet}
              {onRegisterAnother && (
                <button type="button" className={classes.linkInline} onClick={onRegisterAnother}>
                  disconnect
                </button>
              )}
            </dd>
          </div>
        )}
        {maskedEmail && (
          <div className={classes.confirmedRow}>
            <dt>Email</dt>
            <dd>{maskedEmail}</dd>
          </div>
        )}
      </dl>
    )}

    <p className={classes.successText}>
      {deadline ? `Registration closes ${deadline}. ` : ''}Winners are drawn through a publicly
      verifiable draw. We’ll email you only if you win. If selected, you’ll receive claim and
      shipping instructions.
    </p>
  </div>
)

/**
 * Native email + OTP registration, shown after the wallet is verified. Replaces
 * the previous Tally embed. Two steps: enter email → enter the 6-digit code we
 * emailed → success. Authorised by `claimToken`.
 */
export const EmailRegister: FC<{
  claimToken: string
  deadline?: string
  shortWallet?: string
  onRegistered: (maskedEmail: string) => void
  onSessionExpired: () => void
}> = ({ claimToken, deadline, shortWallet, onRegistered, onSessionExpired }) => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onError = (err: unknown) => {
    // An expired claimToken means the wallet must sign again — hand back to the
    // parent to clear the token and return to the sign step.
    if (err instanceof ClaimError && err.kind === 'expired') {
      onSessionExpired()
      return
    }
    setError(err instanceof ClaimError ? err.message : 'Something went wrong. Please try again.')
  }

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      await startEmailVerification(claimToken, email.trim())
      setStep('code')
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  const submitCode = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      await confirmEmailVerification(claimToken, email.trim(), code.trim())
      setStep('done')
      onRegistered(maskEmail(email.trim()))
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  const resend = async () => {
    setError(null)
    setBusy(true)
    try {
      await startEmailVerification(claimToken, email.trim())
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  if (step === 'done') {
    return (
      <RegisteredSuccess deadline={deadline} shortWallet={shortWallet} maskedEmail={maskEmail(email.trim())} />
    )
  }

  return (
    <div className={classes.formCard}>
      <h2 className={classes.formHeading}>Verify your email</h2>
      {deadline && <p className={classes.deadline}>Registration closes: {deadline}</p>}

      {step === 'email' && (
        <form onSubmit={submitEmail} className={classes.emailForm}>
          <p className={classes.emailIntro}>
            Add an email so we can contact you if you win. Used only for this giveaway — never for
            marketing — and deleted after it ends.
          </p>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(null)
            }}
            className={`${classes.input} ${error ? classes.inputError : ''}`}
            aria-invalid={!!error}
            disabled={busy}
          />
          {error && <p className={classes.fieldError}>{error}</p>}
          <Button type="submit" variant="primary" disabled={busy} className={classes.cta}>
            {busy ? 'Sending…' : 'Send code'}
          </Button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={submitCode} className={classes.emailForm}>
          <p className={classes.emailIntro}>
            Enter the 6-digit code we sent to <strong>{email}</strong>.
            {isMockEnabled && (
              <span className={classes.mockHint}> (mock mode — the code is {MOCK_CODE})</span>
            )}
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="xxxxxx"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ''))
              if (error) setError(null)
            }}
            className={`${classes.input} ${classes.codeInput} ${error ? classes.inputError : ''}`}
            aria-invalid={!!error}
            disabled={busy}
          />
          {error && <p className={classes.fieldError}>{error}</p>}
          <div className={classes.codeActions}>
            <Button type="submit" variant="primary" disabled={busy} className={classes.cta}>
              {busy ? 'Verifying…' : 'Verify & register'}
            </Button>
            <button
              type="button"
              className={classes.linkInline}
              onClick={() => void resend()}
              disabled={busy}
            >
              Resend code
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
