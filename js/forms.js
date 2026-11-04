/* Fundament. — contactformulier (/kennismaking) en brochure-aanvraag (homepage) via EmailJS.
   Gedrag ongewijzigd t.o.v. de one-pager; alleen verplaatst naar een eigen bestand. */
(function () {
  'use strict';

  var EMAILJS_PUBLIC_KEY  = 'BTzY2KRWEhyEDs6CR';
  var EMAILJS_SERVICE_ID  = 'service_xv1c43k';
  var EMAILJS_TEMPLATE_ID = 'template_z8hvrkl';
  // Aparte template voor de brochure-aanvraag (met PDF-bijlage, "To Email" = {{to_email}}).
  var EMAILJS_BROCHURE_TEMPLATE_ID = 'YOUR_BROCHURE_TEMPLATE_ID';

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function $(id) { return document.getElementById(id); }

  // ── Contactformulier ─────────────────────────────────────────────────────
  var submitBtn = $('cf-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var name = $('cf-name').value.trim();
      var email = $('cf-email').value.trim();
      var message = $('cf-message').value.trim();
      if (!name || !email || !message) { alert('Vul alle velden in om je bericht te versturen.'); return; }
      if (!emailRe.test(email)) { alert('Vul een geldig e-mailadres in.'); return; }

      submitBtn.textContent = 'Versturen...';
      submitBtn.disabled = true;

      function showSuccess() { $('contact-form').style.display = 'none'; $('contact-success').style.display = 'block'; }

      if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') { setTimeout(showSuccess, 800); return; }  // demo-modus
      if (!window.emailjs) { submitBtn.textContent = 'Verstuur bericht \u2192'; submitBtn.disabled = false; $('contact-error').style.display = 'block'; return; }  // EmailJS kon niet laden

      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        reply_to: email,
        message: 'E-mailadres: ' + email + '\n\n' + message,
        to_emails: 'robin@werkplaats.org, martijn@werkplaats.org'
      }).then(showSuccess, function (err) {
        console.error('EmailJS error:', err);
        submitBtn.textContent = 'Verstuur bericht →';
        submitBtn.disabled = false;
        $('contact-error').style.display = 'block';
      });
    });
  }

  // ── Brochure aanvragen (modal) ───────────────────────────────────────────
  var overlay = $('brochure-overlay');
  if (overlay) {
    var openBtn = $('brochure-open-btn'), closeBtn = $('brochure-close-btn');
    var form = $('brochure-form'), formWrap = $('brochure-form-wrap');
    var okEl = $('brochure-success'), errEl = $('brochure-error'), bSubmit = $('brochure-submit');
    function openModal() { overlay.classList.add('active'); formWrap.style.display = 'block'; okEl.style.display = 'none'; errEl.style.display = 'none'; }
    function closeModal() { overlay.classList.remove('active'); }
    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = $('brochure-email').value.trim();
        if (!emailRe.test(email)) { alert('Vul een geldig e-mailadres in.'); return; }
        bSubmit.textContent = 'Versturen...';
        bSubmit.disabled = true;
        function reset() { bSubmit.textContent = 'Verstuur brochure →'; bSubmit.disabled = false; }

        if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && EMAILJS_BROCHURE_TEMPLATE_ID !== 'YOUR_BROCHURE_TEMPLATE_ID' && !window.emailjs) {
          errEl.style.display = 'block'; reset(); return;  // EmailJS kon niet laden
        }
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || EMAILJS_BROCHURE_TEMPLATE_ID === 'YOUR_BROCHURE_TEMPLATE_ID') {
          // NB: nog niet gekoppeld aan een echte EmailJS-template -> toont alleen "verstuurd" (demo-modus).
          setTimeout(function () { formWrap.style.display = 'none'; okEl.style.display = 'block'; reset(); }, 800);
          return;
        }
        window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BROCHURE_TEMPLATE_ID, { to_email: email, reply_to: email })
          .then(function () { formWrap.style.display = 'none'; okEl.style.display = 'block'; },
                function (err) { console.error('EmailJS error:', err); errEl.style.display = 'block'; })
          .finally(reset);
      });
    }
  }
})();
