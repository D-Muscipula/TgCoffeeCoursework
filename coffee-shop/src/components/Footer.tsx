// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer>
            <div>
                <p>&copy; {new Date().getFullYear()} TgCoffee. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
