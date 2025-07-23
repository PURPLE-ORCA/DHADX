export default function AppLogoIcon(props) {
    return (
        <img
            src="/logo.svg" // The path to your logo in the public directory
            alt="DHADX Logo"
            className="h-12 w-auto" // Control the size here
            {...props}
        />
    );
}
