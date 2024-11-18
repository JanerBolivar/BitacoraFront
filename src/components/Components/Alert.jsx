const Alert = () => {
    return (
        <main className="flex items-center justify-center h-screen bg-gray-100">
            <div className="max-w-lg mx-auto space-y-4 text-center p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
                    Access Denied
                </h3>
                <p className="text-gray-600">
                    Sorry, you do not have permission to access this page. Please contact support if you think this is an error.
                </p>
                <a href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Go back
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
        </main>
    )
}

export default Alert;
