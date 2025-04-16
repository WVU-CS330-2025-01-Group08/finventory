/*
  Function: reportWebVitals
  Description:
    This function is used to measure and report performance metrics for a React app
    using the 'web-vitals' library. It accepts a callback function (onPerfEntry)
    that will be called with the results of each metric.

    These metrics include:
      - CLS (Cumulative Layout Shift)
      - FID (First Input Delay)
      - FCP (First Contentful Paint)
      - LCP (Largest Contentful Paint)
      - TTFB (Time to First Byte)

  Usage:
    Can be passed a logging function or sent to an analytics endpoint.
    Typically called in index.js: `reportWebVitals(console.log)`
*/

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the web-vitals library and call each metric with the callback
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Export the function for use in index.js or other entry points
export default reportWebVitals;