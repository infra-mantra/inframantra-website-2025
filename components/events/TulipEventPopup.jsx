import React, { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import Ajax1 from '../helper/Ajax1';
import styles from './tulipEventPopup.module.css';

/**
 * Popup used ONLY by /gurgaon-tulip-event.
 *
 * Deliberately a separate component from detailSections/POPUPCTA: that one is
 * shared by the three USA NRI pages, and this event needed a different design
 * plus India-first defaults (no city picker, +91 dial code, single date).
 */
function TulipEventPopup({
  open = false,
  onClose,
  name = 'Tulip Monsella Skyhub (Event Specific)',
  eventDate = 'September 6, 2026',
  eventDateLabel = '6th September  |  4:30 PM Onwards',
  venue = 'Tulip Monsella Skyhub, Sector 53, Gurgaon',
  city = 'Gurgaon',
}) {
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);

  // mount -> next frame -> animate in
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [open]);

  // lock body scroll while open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose && onClose(false), 220);
  };

  const validate = () => {
    const e = {};

    if (!form.fullName.trim()) {
      e.fullName = 'Please enter your name';
    } else if (form.fullName.trim().length < 3) {
      e.fullName = 'Name looks too short';
    }

    if (!form.email.trim()) {
      e.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Please enter a valid email';
    }

    const digits = (form.mobile || '').replace(/\D/g, '');
    if (!digits) {
      e.mobile = 'Please enter your mobile number';
    } else if (digits.length < 10) {
      e.mobile = 'Please enter a valid mobile number';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    const { name: field, value } = ev.target;
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await Ajax1({
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.mobile,
        city,
        date: eventDate,
        message: `${city} ${eventDate}`,
        projectName: name,
      });

      setDone(true);
      toast.success('Thank you. Our team will reach out shortly.');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Three fixed CTA bars sit over the page and were covering this
          modal's submit button on phones and iPad:
            .sidebarst   - the WhatsApp / Call / More Info rail (z-index 999)
            .bottom_cta  - the green WhatsApp + Contact Us bar (<=768px)
            .cta_visible - the desktop floating buttons
          Raising the modal's z-index is not enough on its own, because an
          ancestor creates a stacking context that traps it. Hiding them for
          as long as the modal is open is reliable at every viewport; they
          come straight back on close. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .sidebarst,
            .bottom_cta,
            .cta_visible { display: none !important; }
          `,
        }}
      />
    <div
      className={`${styles.tm_overlay} ${visible ? styles.tm_overlayOpen : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="RSVP for the Tulip Monsella Skyhub showcase"
    >
      <div
        className={`${styles.tm_modal} ${visible ? styles.tm_modalOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.tm_closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          <RxCross2 />
        </button>

        {/* ---------- LEFT / BRAND PANEL ---------- */}
        <div className={styles.tm_aside}>
          <p className={styles.tm_eyebrow}>By Invitation</p>

          <p className={styles.tm_asideNote}>
            A landmark address &mdash;{' '}
            <span className={styles.tm_ocPill}>OC Applying Soon</span>
          </p>

          <h2 className={styles.tm_asideTitle}>
            An Exclusive
            <br />
            Sundowner Showcase
          </h2>

          <span className={styles.tm_asideRule} />

          <p className={styles.tm_asideProject}>Iconic Skyhub at Tulip Monsella</p>

          <ul className={styles.tm_factList}>
            <li className={styles.tm_fact}>
              <span className={styles.tm_factLabel}>When</span>
              <span className={styles.tm_factValue}>{eventDateLabel}</span>
            </li>
            <li className={styles.tm_fact}>
              <span className={styles.tm_factLabel}>Where</span>
              <span className={styles.tm_factValue}>{venue}</span>
            </li>
          </ul>

        </div>

        {/* ---------- RIGHT / FORM ---------- */}
        <div className={styles.tm_formPanel}>
          {done ? (
            <div className={styles.tm_successBox}>
              <div className={styles.tm_successTick}>✓</div>
              <h3 className={styles.tm_successTitle}>You&rsquo;re on the list</h3>
              <p className={styles.tm_successText}>
                Thank you for RSVPing. Our team will call you shortly with your
                invitation details for {eventDateLabel}.
              </p>
              <button
                type="button"
                className={styles.tm_submitBtn}
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className={styles.tm_formTitle}>Reserve Your Invitation</h3>
              <p className={styles.tm_formSub}>
                Limited invitations. Share your details and our team will
                confirm your place for the evening.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.tm_field}>
                  <label className={styles.tm_label} htmlFor="tm-name">
                    Full Name <span className={styles.tm_req}>*</span>
                  </label>
                  <input
                    id="tm-name"
                    name="fullName"
                    type="text"
                    className={`${styles.tm_input} ${
                      errors.fullName ? styles.tm_inputError : ''
                    }`}
                    placeholder="Enter your name"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  {errors.fullName && (
                    <span className={styles.tm_errorText}>{errors.fullName}</span>
                  )}
                </div>

                <div className={styles.tm_field}>
                  <label className={styles.tm_label} htmlFor="tm-email">
                    Email <span className={styles.tm_req}>*</span>
                  </label>
                  <input
                    id="tm-email"
                    name="email"
                    type="email"
                    className={`${styles.tm_input} ${
                      errors.email ? styles.tm_inputError : ''
                    }`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className={styles.tm_errorText}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.tm_field}>
                  <label className={styles.tm_label}>
                    Mobile Number <span className={styles.tm_req}>*</span>
                  </label>
                  <PhoneInput
                    country={'in'}
                    value={form.mobile}
                    onChange={(v) => {
                      setForm((p) => ({ ...p, mobile: v }));
                      if (errors.mobile)
                        setErrors((p) => ({ ...p, mobile: '' }));
                    }}
                    inputProps={{ name: 'mobile' }}
                    containerClass={styles.tm_phoneContainer}
                    inputClass={`${styles.tm_phoneInput} ${
                      errors.mobile ? styles.tm_inputError : ''
                    }`}
                    buttonClass={styles.tm_phoneButton}
                  />
                  {errors.mobile && (
                    <span className={styles.tm_errorText}>{errors.mobile}</span>
                  )}
                </div>

                {/* Single-date event: shown as a fact, not a dropdown. */}
                <div className={styles.tm_dateChip}>
                  <span className={styles.tm_dateChipLabel}>Event</span>
                  <span className={styles.tm_dateChipValue}>{eventDateLabel}</span>
                </div>

                <button
                  type="submit"
                  className={styles.tm_submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Reserving…' : 'RSVP for the Evening'}
                </button>

                <p className={styles.tm_consent}>
                  By submitting, you agree to be contacted by Inframantra
                  regarding this event.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default TulipEventPopup;
