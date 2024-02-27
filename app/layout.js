// import theme style scss file
import 'styles/theme.scss';

export const metadata = {
    title: 'CGTS System',
    description: 'Camera Geo Tagging System',
    keywords: 'CGTS, Camera, Geo, Tagging, System'
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-light'>
                {children}
            </body>
        </html>
    )
}
