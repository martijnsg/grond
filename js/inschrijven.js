/* Fundament. — definitief inschrijfformulier (jaarprogramma / 1-op-1 coaching) via EmailJS.
   De serie van 4 avonden loopt via Hipsy en staat dus niet in dit formulier. */
(function () {
  'use strict';
  var EMAILJS_PUBLIC_KEY  = 'BTzY2KRWEhyEDs6CR';
  var EMAILJS_SERVICE_ID  = 'service_xv1c43k';
  var EMAILJS_TEMPLATE_ID = 'template_z8hvrkl';
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); }
  function $(id) { return document.getElementById(id); }

  // Voorselectie via ?programma=jaarprogramma of ?programma=1-op-1
  var param = new URLSearchParams(window.location.search).get('programma');
  var map = { 'jaarprogramma': 's-program-jaarprogramma', '1-op-1': 's-program-coaching' };
  if (param && map[param] && $(map[param])) { $(map[param]).checked = true; }

  $('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var programEl = document.querySelector('input[name="s-program"]:checked');
    var data = {
      program: programEl ? programEl.value : '',
      name: $('s-name').value.trim(), phone: $('s-phone').value.trim(), email: $('s-email').value.trim(),
      address: $('s-address').value.trim(), company: $('s-company').value.trim(), kvk: $('s-kvk').value.trim(),
      invoice_address: $('s-invoice-address').value.trim(), btw: $('s-btw').value.trim(), remarks: $('s-remarks').value.trim()
    };
    if (!data.program) { alert('Kies waarvoor je je inschrijft.'); return; }
    if (!data.name || !data.phone || !data.email || !data.address || !data.company || !data.kvk || !data.invoice_address) {
      alert('Vul alle verplichte velden in.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { alert('Vul een geldig e-mailadres in.'); return; }
    if (!$('s-agree-voorwaarden').checked || !$('s-agree-privacy').checked || !$('s-agree-inschrijving').checked) {
      alert('Vink alle drie de akkoordverklaringen aan om je inschrijving te versturen.'); return;
    }

    var btn = $('s-submit');
    btn.textContent = 'Versturen...';
    btn.disabled = true;
    function showSuccess() { $('signup-form').style.display = 'none'; $('success').style.display = 'block'; }
    function showError() { btn.textContent = 'Inschrijving versturen →'; btn.disabled = false; $('error').style.display = 'block'; }

    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') { setTimeout(showSuccess, 800); return; }  // demo-modus
    if (!window.emailjs) { showError(); return; }  // EmailJS kon niet laden

    var remarksFull = 'Inschrijving voor: ' + data.program + '\nE-mailadres: ' + data.email + '\nAdres: ' + data.address +
      (data.remarks ? '\n\nOverige opmerkingen: ' + data.remarks : '');
    window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      program: data.program, from_name: data.name, phone: data.phone, from_email: data.email, reply_to: data.email,
      address: data.address, company: data.company, kvk: data.kvk, invoice_address: data.invoice_address,
      btw: data.btw, remarks: remarksFull, to_emails: 'robin@werkplaats.org, martijn@werkplaats.org'
    }).then(showSuccess, function (err) { console.error('EmailJS error:', err); showError(); });
  });
})();
