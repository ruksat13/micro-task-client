const Footer = () => {
    return (
        <footer className="bg-violet-900 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold mb-4">MicroTask</h2>
                <div className="flex justify-center gap-6 mb-4">
                    <a href="https://github.com/ruksat13" target="_blank" rel="noreferrer" className="hover:text-violet-300">GitHub</a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-violet-300">Facebook</a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-violet-300">LinkedIn</a>
                </div>
                <p className="text-violet-300 text-sm">© 2025 MicroTask. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;