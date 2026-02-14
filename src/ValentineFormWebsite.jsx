import React, { useMemo, useState } from "react";

const STEPS = [
  {
    key: "identity",
    title: "Identity Verification",
    description: "Please provide legal identification details.",
  },
  {
    key: "address",
    title: "UK Residence Information",
    description: "Please provide your current UK address and contact details.",
  },
  {
    key: "declaration",
    title: "Applicant Declaration",
    description: "Final administrative details before submission.",
  },
  {
    key: "question",
    title: "Final Review",
    description: "One final confirmation is required.",
  },
];

const INITIAL_FORM = {
  fullName: "",
  dateOfBirth: "",
  addressLine1: "",
  addressLine2: "",
  townCity: "",
  county: "",
  postcode: "",
  mobileNumber: "",
  email: "",
  emergencyContact: "",
  declarationAccepted: false,
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function isLikelyUkPostcode(value) {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(value.trim());
}

export default function ValentineFormWebsite() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);

  const step = STEPS[stepIndex];
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / STEPS.length) * 100),
    [stepIndex]
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    setStepIndex((prev) => clamp(prev + 1, 0, STEPS.length - 1));
  }

  function previousStep() {
    setStepIndex((prev) => clamp(prev - 1, 0, STEPS.length - 1));
  }

  function isCurrentStepValid() {
    if (step.key === "identity") {
      return form.fullName.trim().length > 1 && form.dateOfBirth.trim().length > 0;
    }
    if (step.key === "address") {
      return (
        form.addressLine1.trim().length > 5 &&
        form.townCity.trim().length > 1 &&
        form.county.trim().length > 1 &&
        isLikelyUkPostcode(form.postcode) &&
        form.mobileNumber.trim().length >= 10 &&
        form.email.includes("@")
      );
    }
    if (step.key === "declaration") {
      return form.emergencyContact.trim().length > 1 && form.declarationAccepted;
    }
    return true;
  }

  function onSubmit(event) {
    event.preventDefault();
    if (step.key !== "question") {
      if (!isCurrentStepValid()) {
        return;
      }
      nextStep();
    }
  }

  if (submitted) {
    return (
      <main className="page">
        <section className="valentine-yes-card">
          <p className="kicker">Submission Approved</p>
          <h1>Application Accepted.</h1>
          <p className="lead">
            Thank you, {form.fullName || "Applicant"}. Your response has been
            recorded.
          </p>
          <div className="valentine-picture" aria-label="Valentine style picture">
            <svg viewBox="0 0 420 260" role="img" aria-label="Valentine card">
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd9ec" />
                  <stop offset="100%" stopColor="#ffb8d6" />
                </linearGradient>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff5b9a" />
                  <stop offset="100%" stopColor="#d62872" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="420" height="260" rx="20" fill="url(#bgGrad)" />
              <circle cx="70" cy="60" r="10" fill="#ffffff99" />
              <circle cx="340" cy="40" r="8" fill="#ffffff99" />
              <circle cx="380" cy="100" r="12" fill="#ffffff99" />
              <path
                d="M210 200 C160 160, 95 120, 95 72 C95 42, 118 20, 148 20 C174 20, 197 35, 210 56 C223 35, 246 20, 272 20 C302 20, 325 42, 325 72 C325 120, 260 160, 210 200 Z"
                fill="url(#heartGrad)"
              />
              <text
                x="210"
                y="236"
                textAnchor="middle"
                fontFamily="Verdana, sans-serif"
                fontWeight="700"
                fill="#7f1f4f"
              >
                Be Mine
              </text>
            </svg>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <header className="card-header">
          <p className="kicker">Official Information Request Form</p>
          <h1>{step.title}</h1>
          <p className="lead">{step.description}</p>
          <div className="progress-wrap" aria-label="Form progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%</span>
          </div>
        </header>

        <form onSubmit={onSubmit} className="form">
          {step.key === "identity" && (
            <>
              <label className="field">
                <span>Full Name (Legal)</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="First Middle Last"
                  required
                />
              </label>
              <label className="field">
                <span>Date of Birth</span>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  required
                />
              </label>
            </>
          )}

          {step.key === "address" && (
            <>
              <label className="field">
                <span>Address Line 1</span>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => updateField("addressLine1", e.target.value)}
                  placeholder="12 High Street"
                  required
                />
              </label>
              <label className="field">
                <span>Address Line 2 (Optional)</span>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  placeholder="Flat 3B"
                />
              </label>
              <label className="field">
                <span>Town / City</span>
                <input
                  type="text"
                  value={form.townCity}
                  onChange={(e) => updateField("townCity", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span>County</span>
                <input
                  type="text"
                  value={form.county}
                  onChange={(e) => updateField("county", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span>Postcode</span>
                <input
                  type="text"
                  value={form.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                  placeholder="SW1A 1AA"
                  required
                />
              </label>
              <label className="field">
                <span>Mobile Number</span>
                <input
                  type="tel"
                  value={form.mobileNumber}
                  onChange={(e) => updateField("mobileNumber", e.target.value)}
                  placeholder="07xxx xxxxxx"
                  required
                />
              </label>
              <label className="field">
                <span>Email Address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="applicant@example.co.uk"
                  required
                />
              </label>
            </>
          )}

          {step.key === "declaration" && (
            <>
              <label className="field">
                <span>Emergency Contact Full Name</span>
                <input
                  type="text"
                  value={form.emergencyContact}
                  onChange={(e) => updateField("emergencyContact", e.target.value)}
                  placeholder="Emergency contact name"
                  required
                />
              </label>
              <label className="field checkbox-field">
                <input
                  type="checkbox"
                  checked={form.declarationAccepted}
                  onChange={(e) =>
                    updateField("declarationAccepted", e.target.checked)
                  }
                />
                <span>
                  I certify that the above information is complete and accurate.
                </span>
              </label>
            </>
          )}

          {step.key === "question" && (
            <div className="question">
              <p>Will you be my valentines from Joseph?</p>
              <div className="answers">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => setSubmitted(true)}
                >
                  Yes
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => setShowWrongAnswerModal(true)}
                >
                  No
                </button>
              </div>
            </div>
          )}

          <footer className="actions">
            <button
              className="btn btn-outline"
              type="button"
              onClick={previousStep}
              disabled={stepIndex === 0}
            >
              Back
            </button>

            {step.key !== "question" && (
              <button className="btn btn-primary" type="submit">
                Next
              </button>
            )}
          </footer>
        </form>
      </section>

      {showWrongAnswerModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Wrong answer</h2>
            <p>Wrong answer, please select the correct option.</p>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setShowWrongAnswerModal(false)}
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
