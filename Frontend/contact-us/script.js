emailjs.init('2RFHPfNNaQ4YBkSis');

const btn = document.getElementById('button');

document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();

  btn.value = 'Sending...';

  const serviceID = 'default_service';
  const templateID = 'template_wc3j82b';

  emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
    }, (err) => {
      btn.value = 'Send Email';
    });
});
