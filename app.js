/**
 * ChristgardenMail — Personal Email Composer
 * Frontend-only email template & preview app
 */

(function() {
  'use strict';

  // ===== Templates Data =====
  const templates = {
    welcome: {
      source: 'try-again-template.html',
      subject: "Urgent My Child Your Seed of Love 💜 & Faith 🌱 wasn't Sown | Please Try Again",
      body: `<p>Hi there,</p>

<p><strong>Welcome aboard!</strong> We're absolutely thrilled to have you join us.</p>

<p>Here's what you can do to get started:</p>
<ul>
  <li>Complete your profile setup</li>
  <li>Explore the dashboard and features</li>
  <li>Connect with your team members</li>
  <li>Check out our getting-started guide</li>
</ul>

<p>If you have any questions, feel free to reply to this email — we're here to help!</p>

<p>Best regards,<br>
<strong>The Team</strong></p>`
    },
    newsletter: {
      subject: "August Newsletter — What's New",
      body: `<h2>📬 August Highlights</h2>

<p>Hello Reader,</p>

<p>This month we've got some exciting updates to share with you. Here's what's been happening:</p>

<h3>🚀 Top Stories</h3>
<ul>
  <li>Major product update launching next week</li>
  <li>Customer success spotlight: How Acme Corp doubled their efficiency</li>
  <li>Upcoming webinars and community events</li>
</ul>

<h3>📅 Save the Date</h3>
<p>Join us for our annual user conference on <strong>September 20th</strong>. Early bird tickets are available now!</p>

<p>Stay tuned for more updates.</p>

<p>Cheers,<br>
The Editorial Team</p>`
    },
    meeting: {
      source: 'gift-from-us-template.html',
      subject: "Meeting Invitation: Q3 Review",
      body: `<p>Hi,</p>

<p>You are invited to attend the <strong>Q3 Review Meeting</strong>.</p>

<table style="border-collapse:collapse;margin:12px 0;">
  <tr>
    <td style="padding:4px 12px 4px 0;font-weight:600;color:#555;">Date:</td>
    <td style="padding:4px 0;">September 15, 2026</td>
  </tr>
  <tr>
    <td style="padding:4px 12px 4px 0;font-weight:600;color:#555;">Time:</td>
    <td style="padding:4px 0;">2:00 PM – 3:30 PM (EST)</td>
  </tr>
  <tr>
    <td style="padding:4px 12px 4px 0;font-weight:600;color:#555;">Location:</td>
    <td style="padding:4px 0;">Conference Room A / Zoom</td>
  </tr>
  <tr>
    <td style="padding:4px 12px 4px 0;font-weight:600;color:#555;">Agenda:</td>
    <td style="padding:4px 0;">Q3 metrics, Q4 planning, team updates</td>
  </tr>
</table>

<p>Please confirm your attendance by replying to this email.</p>

<p>Thanks,<br>
Admin</p>`
    },
    followup: {
      subject: "Following up on our conversation",
      body: `<p>Hi,</p>

<p>I hope this email finds you well. I wanted to follow up on our discussion from last week regarding the project timeline.</p>

<p>Have you had a chance to review the materials I sent over? I'd love to hear your thoughts and answer any questions you might have.</p>

<p>Looking forward to your response.</p>

<p>Best,<br>
Me</p>`
    },
    thanks: {
      subject: "Thank you for everything!",
      body: `<p>Hi,</p>

<p>I just wanted to take a moment to say <strong>thank you</strong> for your incredible support and collaboration over the past few months.</p>

<p>Your input has been invaluable, and I truly appreciate the time and effort you've dedicated. Projects like this wouldn't be possible without people like you.</p>

<p>Looking forward to working together again in the future!</p>

<p>With gratitude,<br>
Me</p>`
    },
    promo: {
      subject: "Exclusive Offer — 30% Off Inside!",
      body: `<h2>🎉 Special Offer Just for You</h2>

<p>Hi there,</p>

<p>We're excited to offer you an exclusive <strong style="color:#6366f1;font-size:1.1em;">30% discount</strong> on your next purchase.</p>

<div style="background:#f4f4f5;padding:16px 20px;border-radius:8px;text-align:center;margin:16px 0;">
  <p style="margin:0 0 8px;font-size:13px;color:#71717a;">Use code at checkout:</p>
  <code style="font-size:20px;font-weight:700;letter-spacing:2px;color:#18181b;background:#fff;padding:6px 16px;border-radius:6px;border:1px dashed #d4d4d8;">SAVE30</code>
</div>

<p>This offer expires in <strong>48 hours</strong>, so don't miss out!</p>

<p style="text-align:center;margin-top:20px;">
  <a href="#" style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">Shop Now →</a>
</p>

<p style="font-size:12px;color:#a1a1aa;margin-top:20px;">Terms and conditions apply. Cannot be combined with other offers.</p>`
    },
    announce: {
      subject: "Important: Upcoming Changes",
      body: `<h2>We're Making Changes</h2>

<p>Hello,</p>

<p>We wanted to personally inform you about some important updates coming to our platform next month.</p>

<p>These changes are designed to improve your overall experience and bring new features that many of you have been asking for, including:</p>
<ul>
  <li>Enhanced security and privacy controls</li>
  <li>New collaboration tools</li>
  <li>Improved performance and reliability</li>
</ul>

<p>We'll be sharing more detailed information soon. Thank you for your patience and continued support!</p>

<p>— The Management</p>`
    },
    support: {
      subject: "Re: Your Support Request #4821",
      body: `<p>Hi,</p>

<p>Thank you for reaching out to our support team. We have reviewed your request and wanted to provide you with the following update:</p>

<blockquote style="border-left:3px solid #6366f1;margin:16px 0;padding:12px 16px;background:#f4f4f5;border-radius:0 8px 8px 0;">
  <p style="margin:0;color:#52525b;font-size:14px;">Your issue has been escalated to our technical team. Expected resolution time: <strong>24–48 hours</strong>.</p>
</blockquote>

<p>In the meantime, here are some resources that might help:</p>
<ul>
  <li><a href="#">Knowledge Base Article</a></li>
  <li><a href="#">Video Tutorial</a></li>
</ul>

<p>We'll keep you posted on any progress. Thank you for your patience.</p>

<p>Regards,<br>
<strong>Support Team</strong></p>`
    },
    custom: {
      subject: "",
      body: ""
    }
  };

  const seedOptions = {
    faith: { label: 'Seed of Faith', html: 'assets/thank-you/Seeds_of_Faith_Gift_Email.html', pdf: 'assets/thank-you/Seeds_of_Faith.pdf' },
    love: { label: 'Seed of Love', html: 'assets/thank-you/Seeds_of_Love_Gift_Email.html', pdf: 'assets/thank-you/Seeds_of_Love.pdf' },
    healing: { label: 'Seed of Healing', html: 'assets/thank-you/Seeds_of_Healing_Gift_Email.html', pdf: 'assets/thank-you/Seeds_of_Healing.pdf' },
    hope: { label: 'Seed of Hope', html: 'assets/thank-you/Seeds_of_Hope_Gift_Email.html', pdf: 'assets/thank-you/Seeds_of_Hope.pdf' },
    prayer: { label: 'Seed of Prayer', html: 'assets/thank-you/Seeds_of_Prayer_Gift_Email.html', pdf: 'assets/thank-you/Seeds_of_Prayer.pdf' }
  };
  const seedHtmlCache = new Map();
  const giftAttachmentFiles = [
    'Seeds_of_Faith.pdf',
    'Seeds_of_Love.pdf',
    'Seeds_of_Healing.pdf',
    'Seeds_of_Hope.pdf',
    'Seeds_of_Prayer.pdf'
  ];

  // ===== DOM Elements =====
  const sourceCard = document.querySelector('.source-card');
  const attachmentCard = document.querySelector('.attachments-card');
  if (sourceCard && attachmentCard) {
    sourceCard.closest('.compose-panel').insertBefore(attachmentCard, sourceCard);
  }

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const els = {
    templateButtons: $$('.template-btn'),
    templateScroll: $('#templateScroll'),
    recipientList: $('#recipientList'),
    recipientsCard: $('.recipients-card'),
    addRecipient: $('#addRecipient'),
    subject: $('#subjectField'),
    preview: $('#previewFrame'),
    sourceCode: $('#sourceCode'),
    sourceCard: $('.source-card'),
    sourceToggleBtn: $('#sourceToggleBtn'),
    dropzone: $('#dropzone'),
    fileInput: $('#fileInput'),
    attachList: $('#attachList'),
    sendBtn: $('#sendBtn'),
    saveDraftBtn: $('#saveDraftBtn'),
    clearBtn: $('#clearBtn'),
    actionStatus: $('#actionStatus'),
    renderHtmlBtn: $('#renderHtmlBtn'),
    copyHtml: $('#copyHtml'),
    toast: $('#toast'),
    toastMsg: $('#toastMsg')
  };

  let currentTemplate = 'welcome';
  let attachments = [];
  let activeThankYouRow = null;
  let thankYouRenderVersion = 0;

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function showToast(message, type = 'success') {
    els.toastMsg.textContent = message;
    const icon = els.toast.querySelector('.toast-icon');
    icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : '!';
    icon.style.background = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--warning)';
    els.toast.classList.add('show');
    window.setTimeout(() => els.toast.classList.remove('show'), 3000);
  }

  function setStatus(text, type = '') {
    els.actionStatus.textContent = text;
    els.actionStatus.className = `action-status${type ? ` ${type}` : ''}`;
  }

  function bindTemplateButton(button) {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      els.templateScroll.querySelectorAll('.template-btn').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      loadTemplate(button.dataset.template);
      showToast(`Loaded "${button.textContent.trim()}" template`);
    });
  }

  function getRecipientEntries() {
    return Array.from(els.recipientList.querySelectorAll('.recipient-row'))
      .map(row => ({
        email: row.querySelector('.recipient-input')?.value.trim() || '',
        name: row.querySelector('.recipient-name')?.value.trim() || '',
        seed: row.querySelector('.seed-select')?.value || 'faith'
      }))
      .filter(recipient => recipient.email);
  }

  function getRecipients() {
    return getRecipientEntries().map(recipient => recipient.email);
  }

  function getFirstRecipientName() {
    return getRecipientEntries()[0]?.name || '';
  }

  function personalizeHtml(html, name = getFirstRecipientName()) {
    if (!name) return html;
    const safeName = escapeHtml(name);
    return html
      .replace(/\{\{\s*(?:name|recipient[_-]?name)\s*\}\}/gi, safeName)
      .replace(/\bBeliever\b/gi, safeName)
      .replace(/\bBeliver\b/gi, safeName);
  }

  function addRecipientField(value = '', removable = true) {
    const recipient = typeof value === 'string' ? { email: value, name: '' } : value;
    const row = document.createElement('div');
    row.className = 'recipient-row';

    const input = document.createElement('input');
    input.type = 'email';
    input.className = 'recipient-input';
    input.placeholder = 'recipient@example.com';
    input.autocomplete = 'email';
    input.value = recipient.email || '';
    row.appendChild(input);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'recipient-name';
    nameInput.placeholder = 'Recipient name';
    nameInput.autocomplete = 'name';
    nameInput.setAttribute('aria-label', 'Recipient name');
    nameInput.value = recipient.name || '';
    row.appendChild(nameInput);

    const seedSelect = document.createElement('select');
    seedSelect.className = 'seed-select';
    seedSelect.setAttribute('aria-label', 'Thank You seed template');
    Object.entries(seedOptions).forEach(([key, option]) => {
      const seedOption = document.createElement('option');
      seedOption.value = key;
      seedOption.textContent = option.label;
      seedSelect.appendChild(seedOption);
    });
    seedSelect.value = recipient.seed || 'faith';
    seedSelect.addEventListener('change', () => {
      activeThankYouRow = row;
      if (currentTemplate === 'newsletter') renderSelectedThankYou(row);
    });
    row.appendChild(seedSelect);

    if (removable) {
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'remove-recipient-btn';
      removeButton.setAttribute('aria-label', 'Remove recipient');
      removeButton.title = 'Remove recipient';
      removeButton.innerHTML = '&times;';
      removeButton.addEventListener('click', () => row.remove());
      row.appendChild(removeButton);
    }

    els.recipientList.appendChild(row);
    return input;
  }

  function setRecipients(recipients = []) {
    activeThankYouRow = null;
    const values = recipients.length ? recipients : [''];
    els.recipientList.innerHTML = '';
    values.forEach((value, index) => addRecipientField(value, index > 0));
  }

  function setThankYouMode(enabled) {
    els.recipientsCard.classList.toggle('thank-you-mode', enabled);
  }

  async function getSeedHtml(seed) {
    if (!seedHtmlCache.has(seed)) {
      const request = fetch(seedOptions[seed].html).then(response => {
        if (!response.ok) throw new Error(`Could not load ${seedOptions[seed].label}`);
        return response.text();
      });
      seedHtmlCache.set(seed, request);
    }
    return seedHtmlCache.get(seed);
  }

  async function renderSelectedThankYou(row = activeThankYouRow) {
    const renderVersion = ++thankYouRenderVersion;
    const sourceRow = row || els.recipientList.querySelector('.recipient-row');
    const first = sourceRow ? {
      seed: sourceRow.querySelector('.seed-select')?.value || 'faith',
      name: sourceRow.querySelector('.recipient-name')?.value.trim() || ''
    } : { seed: 'faith', name: '' };
    const seed = seedOptions[first.seed] ? first.seed : 'faith';
    try {
      const source = await getSeedHtml(seed);
      if (renderVersion !== thankYouRenderVersion) return;
      const parsed = new DOMParser().parseFromString(source, 'text/html');
      const title = parsed.querySelector('title')?.textContent.trim();
      if (title) els.subject.value = title;
      els.sourceCode.value = personalizeHtml(source, first.name);
      setPreviewDocument(els.sourceCode.value);
      await loadSeedAttachment(seed, renderVersion);
    } catch (error) {
      showToast('Could not load the selected gift email', 'error');
      console.warn(error);
    }
  }

  async function loadSeedAttachment(seed, renderVersion = thankYouRenderVersion) {
    const option = seedOptions[seed];
    const response = await fetch(option.pdf);
    if (!response.ok) throw new Error(`Could not load ${option.label} ebook`);
    const blob = await response.blob();
    if (renderVersion !== thankYouRenderVersion) return;
    attachments = [new File([blob], option.pdf.split('/').pop(), { type: 'application/pdf' })];
    renderAttachments();
  }

  async function renderGiftFromUs() {
    const renderVersion = ++thankYouRenderVersion;
    const row = activeThankYouRow || els.recipientList.querySelector('.recipient-row');
    const name = row?.querySelector('.recipient-name')?.value.trim() || getFirstRecipientName();
    try {
      const response = await fetch('gift-from-us-template.html');
      if (!response.ok) throw new Error('Could not load Gift From us template');
      const source = await response.text();
      if (renderVersion !== thankYouRenderVersion) return;
      const parsed = new DOMParser().parseFromString(source, 'text/html');
      const title = parsed.querySelector('title')?.textContent.trim();
      if (title) els.subject.value = title;
      els.sourceCode.value = personalizeHtml(source, name);
      setPreviewDocument(els.sourceCode.value);

      const files = await Promise.all(giftAttachmentFiles.map(async filename => {
        const fileResponse = await fetch(`assets/thank-you/${filename}`);
        if (!fileResponse.ok) throw new Error(`Could not load ${filename}`);
        const blob = await fileResponse.blob();
        return new File([blob], filename, { type: 'application/pdf' });
      }));
      if (renderVersion !== thankYouRenderVersion) return;
      attachments = files;
      renderAttachments();
    } catch (error) {
      showToast('Could not load the Gift From us email', 'error');
      console.warn(error);
    }
  }

  function getBodyHtml() {
    const body = els.preview.contentDocument?.body;
    if (!body) return '';
    return body.textContent.trim() || body.querySelector('img, table, hr')
      ? body.innerHTML
      : '';
  }

  function createEmailDoc(body, subject) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject || 'No Subject')}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; max-width: 600px; margin: 24px auto; padding: 0 20px; background: #fff; }
  h2, h3 { color: #18181b; margin-top: 24px; margin-bottom: 12px; }
  p { margin: 12px 0; }
  ul { padding-left: 24px; }
  li { margin: 6px 0; }
  blockquote { border-left: 3px solid #6366f1; margin: 16px 0; padding: 12px 16px; background: #f4f4f5; border-radius: 0 8px 8px 0; }
  code { font-family: 'SF Mono', monospace; background: #f4f4f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  a { color: #6366f1; text-decoration: none; }
  table { width: 100%; }
  strong { font-weight: 600; }
</style>
</head>
<body>
${body}
</body>
</html>`;
  }

  function buildHtmlDoc() {
    const doc = els.preview.contentDocument;
    if (doc?.documentElement && doc.body) {
      const clone = doc.documentElement.cloneNode(true);
      const title = clone.querySelector('title');
      if (title) title.textContent = els.subject.value || 'No Subject';
      return `<!DOCTYPE html>\n${clone.outerHTML}`;
    }
    return createEmailDoc(getBodyHtml(), els.subject.value);
  }

  function setPreviewDocument(html, syncSource = false) {
    els.preview.onload = () => {
      const body = els.preview.contentDocument?.body;
      if (!body) return;
      body.contentEditable = 'true';
      body.spellcheck = true;
      body.addEventListener('input', updateSource);
      if (syncSource) updateSource();
    };
    // Email markup is isolated in the iframe; remove executable content before rendering.
    const safeHtml = html
      .replace(/<script\b[\s\S]*?<\/script>/gi, '')
      .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    els.preview.srcdoc = safeHtml;
  }

  function updateSource() {
    els.sourceCode.value = buildHtmlDoc();
  }

  async function loadTemplate(key) {
    const template = templates[key];
    if (!template) return;

    currentTemplate = key;
    setThankYouMode(key === 'newsletter');
    if (key === 'newsletter') {
      await renderSelectedThankYou();
      return;
    }
    if (key === 'meeting') {
      setThankYouMode(false);
      await renderGiftFromUs();
      return;
    }
    if (template.source) {
      try {
        const response = await fetch(template.source);
        const source = await response.text();
        els.sourceCode.value = source;
        const parsed = new DOMParser().parseFromString(source, 'text/html');
        const parsedTitle = parsed.querySelector('title')?.textContent.trim();
        if (parsedTitle && parsedTitle !== 'No Subject') els.subject.value = parsedTitle;
        renderSourceToPreview();
        return;
      } catch (error) {
        console.warn('Could not load template source', error);
      }
    }
    els.subject.value = template.subject;
    setPreviewDocument(createEmailDoc(template.body, template.subject), true);
  }

  els.templateButtons.forEach(bindTemplateButton);

  els.addRecipient.addEventListener('click', () => addRecipientField().focus());
  els.sourceToggleBtn.addEventListener('click', () => {
    const expanded = !els.sourceCard.classList.toggle('collapsed');
    els.sourceToggleBtn.setAttribute('aria-expanded', String(expanded));
    els.sourceToggleBtn.setAttribute('aria-label', expanded ? 'Hide HTML editor' : 'Show HTML editor');
    els.sourceToggleBtn.title = expanded ? 'Hide HTML editor' : 'Show HTML editor';
  });
  els.recipientList.addEventListener('input', event => {
    if (event.target.classList.contains('recipient-name')) {
      if (currentTemplate === 'newsletter') renderSelectedThankYou(event.target.closest('.recipient-row'));
      else if (currentTemplate === 'meeting') renderGiftFromUs();
      else renderSourceToPreview();
    }
  });
  els.subject.addEventListener('input', updateSource);
  function renderSourceToPreview() {
    const source = els.sourceCode.value;
    const parsed = new DOMParser().parseFromString(source, 'text/html');
    const parsedTitle = parsed.querySelector('title')?.textContent.trim();
    if (parsedTitle && parsedTitle !== 'No Subject') els.subject.value = parsedTitle;
    const selectedName = activeThankYouRow?.querySelector('.recipient-name')?.value.trim() || getFirstRecipientName();
    setPreviewDocument(personalizeHtml(source, selectedName));
  }

  // Keep the preview live while editing, with the play button available for an explicit render.
  els.sourceCode.addEventListener('input', renderSourceToPreview);
  els.renderHtmlBtn.addEventListener('click', () => {
    renderSourceToPreview();
    showToast('HTML rendered in live preview');
  });

  els.dropzone.addEventListener('click', () => els.fileInput.click());
  els.dropzone.addEventListener('dragover', event => {
    event.preventDefault();
    els.dropzone.classList.add('dragover');
  });
  els.dropzone.addEventListener('dragleave', () => els.dropzone.classList.remove('dragover'));
  els.dropzone.addEventListener('drop', event => {
    event.preventDefault();
    els.dropzone.classList.remove('dragover');
    handleFiles(event.dataTransfer.files);
  });
  els.fileInput.addEventListener('change', event => {
    handleFiles(event.target.files);
    els.fileInput.value = '';
  });

  function handleFiles(fileList) {
    Array.from(fileList).forEach(file => {
      if (!attachments.find(item => item.name === file.name && item.size === file.size)) {
        attachments.push(file);
      }
    });
    renderAttachments();
    if (fileList.length) showToast(`${fileList.length} file(s) attached`);
  }

  function renderAttachments() {
    els.attachList.innerHTML = '';
    attachments.forEach((file, index) => {
      const size = file.size < 1024
        ? `${file.size} B`
        : file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const chip = document.createElement('div');
      chip.className = 'attach-chip';
      chip.innerHTML = `
        <span>${escapeHtml(file.name)}</span>
        <span class="attach-size">${size}</span>
        <button type="button" title="Remove attachment" aria-label="Remove ${escapeHtml(file.name)}">&times;</button>
      `;
      chip.querySelector('button').addEventListener('click', () => {
        attachments.splice(index, 1);
        renderAttachments();
      });
      els.attachList.appendChild(chip);
    });
  }

  els.copyHtml.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(els.sourceCode.value);
      showToast('HTML copied to clipboard');
    } catch (error) {
      showToast('Failed to copy HTML', 'error');
    }
  });

  els.sendBtn.addEventListener('click', async () => {
    const recipientInputs = Array.from(els.recipientList.querySelectorAll('.recipient-input'));
    const invalidRecipient = recipientInputs.find(input => input.value.trim() && !input.checkValidity());
    const recipientEntries = getRecipientEntries();
    const recipients = recipientEntries.map(recipient => recipient.email);

    if (!recipients.length) {
      setStatus('Please add a recipient', 'error');
      showToast('At least one recipient is required', 'error');
      recipientInputs[0].focus();
      return;
    }
    if (invalidRecipient) {
      setStatus('Please check the recipient email', 'error');
      showToast('Enter a valid recipient email', 'error');
      invalidRecipient.focus();
      return;
    }
    if (!els.subject.value.trim()) {
      setStatus('Please enter a subject', 'error');
      showToast('Subject is required', 'error');
      els.subject.focus();
      return;
    }

    setStatus('Sending...', 'sending');
    els.sendBtn.disabled = true;
    const messages = recipientEntries.map(recipient => ({
      email: recipient.email,
      name: recipient.name,
      html: personalizeHtml(els.sourceCode.value, recipient.name),
      attachments: currentTemplate === 'newsletter'
        ? [seedOptions[recipient.seed]?.pdf].filter(Boolean)
        : currentTemplate === 'meeting'
          ? giftAttachmentFiles.map(filename => `assets/thank-you/${filename}`)
          : []
    }));
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: els.subject.value, messages })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Email delivery failed');
      setStatus('Email sent successfully', 'success');
      showToast(`${result.sent || recipients.length} email(s) sent successfully`);
    } catch (error) {
      setStatus('Email could not be sent', 'error');
      showToast(error.message || 'Email delivery failed', 'error');
    } finally {
      els.sendBtn.disabled = false;
    }
  });

  els.saveDraftBtn.addEventListener('click', () => {
    const draft = {
      template: currentTemplate,
      recipients: getRecipientEntries(),
      subject: els.subject.value,
      body: getBodyHtml(),
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('christgardenmail_draft', JSON.stringify(draft));
    setStatus('Draft saved locally');
    showToast('Draft saved to browser storage');
  });

  els.clearBtn.addEventListener('click', () => {
    if (!window.confirm('Are you sure you want to clear everything?')) return;
    setRecipients();
    setThankYouMode(false);
    els.subject.value = '';
    attachments = [];
    renderAttachments();
    els.templateButtons.forEach(button => button.classList.remove('active'));
    currentTemplate = '';
    setPreviewDocument(createEmailDoc('', ''), true);
    setStatus('Cleared');
    showToast('Composer cleared');
  });

  function loadDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem('christgardenmail_draft'));
      if (!draft) return;
      setRecipients(draft.recipients || (draft.to ? [draft.to] : []));
      els.subject.value = draft.template === 'welcome'
        ? templates.welcome.subject
        : (draft.subject || '');
      currentTemplate = draft.template || 'custom';
      setThankYouMode(currentTemplate === 'newsletter');
      els.templateButtons.forEach(button => button.classList.toggle('active', button.dataset.template === currentTemplate));
      if (currentTemplate === 'newsletter') renderSelectedThankYou();
      else if (currentTemplate === 'meeting') renderGiftFromUs();
      else setPreviewDocument(createEmailDoc(draft.body || '', draft.subject || ''), true);
      setStatus('Draft restored from last session');
    } catch (error) {
      console.warn('Could not restore draft', error);
    }
  }

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      els.sendBtn.click();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      els.saveDraftBtn.click();
    }
  });

  setRecipients();
  loadTemplate('welcome');
  loadDraft();

  console.log('%c ChristgardenMail ', 'background:#6366f1;color:#fff;padding:4px 10px;border-radius:4px;font-weight:600;', 'Ready to compose!');
  console.log('Shortcuts: Ctrl+Enter = Send | Ctrl+S = Save Draft');

})();
