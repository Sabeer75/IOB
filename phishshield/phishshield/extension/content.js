document.addEventListener("DOMContentLoaded", function() {
    let forms = document.querySelectorAll("form");
    let suspiciousFields = 0;

    forms.forEach(form => {
        let inputs = form.querySelectorAll("input[type='password'], input[type='text']");
        if (inputs.length > 3) suspiciousFields++;
    });

    if (suspiciousFields > 0) {
        document.body.style.border = "5px solid red";
    }
});
