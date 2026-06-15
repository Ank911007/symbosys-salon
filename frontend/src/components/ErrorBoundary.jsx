import { Component } from 'react';
import * as Sentry from '@sentry/react';

/**
 * ErrorBoundary — catches render errors and displays a branded fallback UI.
 * Prevents white-screen crashes in production.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service in production
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Send the error to Sentry's dashboard
    Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 text-center transition-colors duration-500">
          <span className="font-syne text-[10px] tracking-[0.25em] text-text-muted uppercase mb-4">
            Something went wrong
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-text-primary mb-4">
            We&apos;ll be right back.
          </h1>
          <p className="font-syne text-sm text-text-muted max-w-md mb-8 leading-relaxed">
            An unexpected error occurred. Please try refreshing the page or come back in a moment.
          </p>
          <button
            onClick={this.handleRetry}
            className="bg-sage text-canvas font-syne font-bold text-xs tracking-widest px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer"
          >
            TRY AGAIN
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
