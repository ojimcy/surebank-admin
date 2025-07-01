import React, { useState, useEffect } from 'react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Button,
    useDisclosure,
} from '@chakra-ui/react';

const ExtensionNotice = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [hasExtensionError, setHasExtensionError] = useState(false);

    useEffect(() => {
        // Check for extension-related errors
        const checkForExtensionErrors = () => {
            const errorMessages = [
                'chrome-extension://',
                'Cannot read properties of null',
                'extension',
            ];

            // Override console.error to detect extension errors
            const originalError = console.error;
            console.error = function (...args) {
                const errorString = args.join(' ');

                if (errorMessages.some(msg => errorString.includes(msg))) {
                    setHasExtensionError(true);
                    onOpen();
                }

                originalError.apply(console, args);
            };

            // Cleanup
            return () => {
                console.error = originalError;
            };
        };

        const cleanup = checkForExtensionErrors();
        return cleanup;
    }, [onOpen]);

    const handleDismiss = () => {
        onClose();
        // Remember user's choice to dismiss
        localStorage.setItem('extensionNoticeShown', 'true');
    };

    // Don't show if user has already dismissed
    const alreadyDismissed = localStorage.getItem('extensionNoticeShown');

    if (!isOpen || !hasExtensionError || alreadyDismissed) {
        return null;
    }

    return (
        <Box position="fixed" top="4" right="4" zIndex="9999" maxWidth="400px">
            <Alert status="warning" borderRadius="md" boxShadow="lg">
                <AlertIcon />
                <Box>
                    <AlertTitle>Browser Extensions Detected</AlertTitle>
                    <AlertDescription>
                        We've detected browser extensions that might interfere with the app.
                        If you experience issues, try disabling browser extensions or using
                        an incognito/private browsing window.
                    </AlertDescription>
                    <Button
                        size="sm"
                        mt="2"
                        onClick={handleDismiss}
                        colorScheme="orange"
                        variant="outline"
                    >
                        Got it
                    </Button>
                </Box>
            </Alert>
        </Box>
    );
};

export default ExtensionNotice; 