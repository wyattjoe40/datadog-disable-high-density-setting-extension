log("Starting DataDog Disable High-Density Setting Extension")

const configureButtonObserver = new MutationObserver((mutationsList, observer) => {
    // Check if the Configure button is now in the DOM
    // We will need to click the Configure button to show the "Increase density on wide screens" checkbox
    const configureButton = document.querySelector('button[aria-label="Open dashboard options"]');

    if (!configureButton) {
        log('No configure button found')
        return
    }

    // Stop observing once the configure button has been found.
    observer.disconnect();

    log('Found the Configure button. Clicking it.')

    configureButton.click();

    // Set up an observer to check for when the Configure panel is open
    const highDensityObserver = new MutationObserver((mutationsList, observer) => {
        // We have two elements we care about:
        // 1. highDensityInput: This is the DOM element that contains the on/off value for High Density mode
        // 2. highDensityCheckbox: This is the DOM element that is clicked to turn on/off High Density mode 

        const highDensityInput = document.evaluate("//span[text()='Increase density on wide screens']/following-sibling::button/div/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!highDensityInput) {
            log('No high density input found')
            return
        }

        // Stop observing once we know the high density setting is rendered
        observer.disconnect();

        if (highDensityInput.value !== 'on') {
            log('High density input is not off');
            return;
        }

        const highDensityCheckbox = document.evaluate("//span[text()='Increase density on wide screens']/following-sibling::button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!highDensityCheckbox) {
            log('no high density checkbox')
            return;
        }

        log('Clicking checkbox', highDensityCheckbox);
        highDensityCheckbox.click();

        closeConfigPanel();
    });

    // Start observing the DOM for when the Configuration panel is open and the High Density setting is available
    highDensityObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
});

// Start observing the DOM for when the Configure button is available
configureButtonObserver.observe(document.body, {
    childList: true,
    subtree: true,
});






/******* Utilities ********/


/**
 * If the configuration panel is open then close it
 * @returns 
 */
function closeConfigPanel() {
    log('Closing the Configure panel.')

    // The exit button itself doesn't have unique class. However, the exit button's sibling, the configuration panel, does. So grab the sibling
    const configurationPanel = document.querySelector('.configure__panel__contents');

    if (!configurationPanel) {
        log('no configuration panel')
        return;
    }

    const configurationPanelExitButton = configurationPanel.previousElementSibling;

    if (!configurationPanelExitButton) {
        log('no configuration panel exit button')
        return;
    }

    configurationPanelExitButton.click();
}


function log(...p1) {
    p1.unshift("[DISABLE-HIGH-DENSITY--EXTENSION]")
    console.log(p1);
}