import React from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Check if this is an extension-related error
        if (error && error.stack && error.stack.includes('chrome-extension://')) {
            // Don't show error UI for extension errors, just ignore them
            return { hasError: false, error: null };
        }

        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Check if this is an extension-related error
        if (error && error.stack && error.stack.includes('chrome-extension://')) {
            // Log extension errors but don't display them to users
            console.warn('Browser extension error caught and ignored:', error);
            return;
        }

        // Log non-extension errors
        console.error('Application error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                    p={4}
                >
                    <VStack spacing={4} textAlign="center">
                        <Text fontSize="xl" fontWeight="bold">
                            Something went wrong
                        </Text>
                        <Text color="gray.600">
                            We encountered an unexpected error. Please try refreshing the page.
                        </Text>
                        <Button
                            colorScheme="blue"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </Button>
                    </VStack>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 