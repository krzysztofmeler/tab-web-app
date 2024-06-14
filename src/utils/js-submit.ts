const jsSubmit =
    (handler: () => void) => (e: { preventDefault: () => void }) => {
        e.preventDefault();
        handler();
    };

export { jsSubmit };
