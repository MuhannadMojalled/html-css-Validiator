async function validateHTML(htmlContent) {
    // this based on the api docs at https://github.com/validator/validator/wiki/Service-%C2%BB-HTTP-interface
    const response = await fetch('https://validator.w3.org/nu/?out=json', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        },
        body: htmlContent
    });

    // If the response is not 200
    if (!response.ok) {
        throw new Error('HTML validation failed');
    }

    return await response.json();
}

async function validateCSS(cssContent) {
    // this based on the api docs at https://jigsaw.w3.org/css-validator/manual.html
    const response = await fetch(`https://jigsaw.w3.org/css-validator/validator?text=${encodeURIComponent(cssContent)}&output=json`, {
        method: 'GET'
    });

    // If the response is not 200
    if (!response.ok) {
        throw new Error('CSS validation failed');
    }

    return await response.json();
}

async function validateCode() {
    // using trim() to remove the spaces because the api was showing an error for some reasons(?).
    const htmlContent = document.getElementById('htmlArea').value.trim();
    const cssContent = document.getElementById('cssArea').value.trim();
    const resultDiv = document.getElementById('results');

    // inserting a msg to make it look responsive and cool B)
    resultDiv.innerHTML = 'Validating...';

    try {
        // initializing the results as empty
        let resultHTML = '';
        let resultCSS = '';

        // if there is html
        if (htmlContent) {
            // calling the html validate function
            const htmlResult = await validateHTML(htmlContent);
            resultHTML = '<h3>HTML Validation Results:</h3>';
            // if the api returend an error in the html
            if (htmlResult.messages && htmlResult.messages.length > 0) {
                // go over all the error and insert to the results
                htmlResult.messages.forEach(msg => {
                    resultHTML += `<p class="error">${msg.message}</p>`;
                });
            } else {
                resultHTML += '<p>No errors found in HTML.</p>';
            }
        }

        // if there is css
        if (cssContent) {
            // calling the css validate function
            const cssResult = await validateCSS(cssContent);
            resultCSS = '<h3>CSS Validation Results:</h3>';
            // if the cssvalidation and the cssvalidations.errors exisits and the errors length is more than 0
            if (cssResult.cssvalidation && cssResult.cssvalidation.errors && cssResult.cssvalidation.errors.length > 0) {
                // loop over each error and insert to the results
                cssResult.cssvalidation.errors.forEach(error => {
                    resultCSS += `<p class="error">${error.message}</p>`;
                });
            } else {
                resultCSS += '<p>No errors found in CSS.</p>';
            }
        }

        // if the user did not provide html/css 
        if (!htmlContent && !cssContent) {
            resultDiv.innerHTML = `<p class="error">Please enter HTML or CSS to validate.</p>`;
        } else {
            resultDiv.innerHTML = resultHTML + resultCSS;
        }

    }
    // a catch incase an error ocured 
    catch (error) {
        resultDiv.innerHTML = `<p class="error">Error during validation: ${error.message}</p>`;
    }
}

// listener for the button
const button = document.getElementById('codeSubmit');
button.addEventListener('click', validateCode);