import { useState } from 'react';

const TermsAndCondition = () => {
    const [openSection, setOpenSection] = useState<number | null>(null);

    const toggleSection = (index: number) => {
        setOpenSection(openSection === index ? null : index);
    };

    return (
        <div className="container mx-20 w-fit p-4">
            <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
            <p className="mb-4">Last Updated: 28th February 2025</p>

            <p className="mb-4">
                Welcome to Takshak Event Management! These Terms and Conditions ("Terms") govern your access to and use of our website (https://takshakagt.in/) and any related services provided by Takshak. By using our website and services, you agree to be bound by these Terms. If you do not agree, please refrain from using our services.
            </p>

            {sections.map((section, index) => (
                <div key={index} className="mb-4 border-b pb-4">
                    <h2
                        className="text-2xl font-semibold mb-2 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleSection(index)}
                    >
                        {section.title}
                        <span className={`transform transition-transform duration-300 ${openSection === index ? 'rotate-180' : 'rotate-0'}`}>
                            ▼
                        </span>
                    </h2>
                    <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${openSection === index ? 'max-h-screen' : 'max-h-0'}`}>
                        {section.content.map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            ))}

            <p className="mb-4">By using our services, you acknowledge that you have read and understood these Terms and agree to comply with them.</p>
        </div>
    );
};

const sections = [
    {
        title: '1. General Information',
        content: [
            'Takshak Event Management is a company based in Agartala, Tripura, India.',
            'We specialize in event organizing and management, ensuring seamless execution of entertainment events. Our services include: Concert & Music Event Management, Event Planning & Coordination, Ticket Booking & Management, Vendor & Partner Coordination, Marketing & Promotions.',
            'These Terms apply to all visitors, users, and customers of our website.'
        ]
    },
    {
        title: '2. User Eligibility',
        content: [
            'You must be at least 18 years old to use our services. If you are under 18, you must have permission from a parent or legal guardian.',
            'By accessing our services, you confirm that all information provided is accurate and complete.'
        ]
    },
    {
        title: '3. Account Registration',
        content: [
            'To access certain features, you may need to create an account.',
            'You are responsible for maintaining the confidentiality of your account credentials.',
            'Any unauthorized use of your account must be reported to us immediately.'
        ]
    },
    {
        title: '4. Payments and Transactions',
        content: [
            'All payments are processed securely through our payment gateway providers.',
            'We accept payments through UPI/Card/Net Banking.',
            'By making a purchase, you agree to provide accurate billing and payment information.',
            'Takshak reserves the right to refuse or cancel any order in cases of suspected fraud or unauthorized transactions.'
        ]
    },
    {
        title: '5. Refund and Cancellation Policy',
        content: [
            'Please refer to our Cancellation and Refund Policy for information on cancellations, refunds, and returns.'
        ]
    },
    {
        title: '6. Shipping and Delivery',
        content: [
            'Tickets purchased through our website will be delivered electronically.',
            'Please ensure that the email address provided is accurate and up-to-date'
        ]
    },
    {
        title: '7. Intellectual Property',
        content: [
            'All content, including text, graphics, logos, and trademarks, is the property of Takshak and protected under applicable laws.',
            'You may not reproduce, distribute, or use our content without prior written permission.'
        ]
    },
    {
        title: '8. Prohibited Activities',
        content: [
            'You agree not to engage in fraudulent, abusive, or unlawful activities while using our website.',
            'The use of our services for any illegal purposes, including money laundering or fraudulent transactions, is strictly prohibited.'
        ]
    },
    {
        title: '9. Privacy Policy',
        content: [
            'Your use of our services is also governed by our Privacy Policy.',
            'We collect and process personal data in compliance with applicable laws.'
        ]
    },
    {
        title: '10. Limitation of Liability',
        content: [
            'Takshak is not liable for any direct, indirect, or consequential damages resulting from the use of our services.',
            'We do not guarantee uninterrupted or error-free access to our website.'
        ]
    },
    {
        title: '11. Indemnification',
        content: [
            'You agree to indemnify and hold harmless Takshak from any claims, losses, or damages arising from your violation of these Terms.'
        ]
    },
    {
        title: '12. Changes to These Terms',
        content: [
            'We reserve the right to update or modify these Terms at any time.',
            'Changes will be effective upon posting on our website. Continued use of our services after modifications constitutes acceptance of the new Terms.'
        ]
    },
    {
        title: '13. Governing Law and Jurisdiction',
        content: [
            'These Terms shall be governed by and construed in accordance with the laws of India.',
            'Any disputes shall be subject to the exclusive jurisdiction of the courts in Agartala, Tripura.'
        ]
    },
    {
        title: '14. Contact Us',
        content: [
            'If you have any questions or concerns about the Terms and Conditions, please contact us at:',
            'Email: chiagartala@gmail.com',
            'Phone: +91-7005483524',
            'Address: Dhaleswar Kalyani, Agartala, Tripura, India'
        ]
    }
];

export default TermsAndCondition;