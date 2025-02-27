import { useState } from 'react';

const PrivacyPolicy = () => {
    const [openSection, setOpenSection] = useState<number | null>(null);

    const toggleSection = (index: number) => {
        setOpenSection(openSection === index ? null : index);
    };

    return (
        <div className="container mx-20 w-fit p-4">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="mb-4">
                At takshakagt, we are committed to safeguarding your privacy. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our event ticket booking application. By accessing or using our services, you agree to the terms of this policy.
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

            <p className="mb-4">
                By using our application, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
        </div>
    );
};

const sections = [
    {
        title: 'Information We Collect',
        content: [
            'Personal Information: When you register or book tickets through our application, we may collect personal details such as your name, email address, phone number, and payment information.',
            'Technical Information: We automatically collect certain technical data when you use our application, including your IP address, browser type, operating system, and access times. This information helps us improve our services and enhance user experience.'
        ]
    },
    {
        title: 'Use of Information',
        content: [
            'The information we collect is used to:',
            'Process your ticket bookings and payments.',
            'Provide customer support and respond to inquiries.',
            'Send you updates, promotional materials, and other information related to events you may be interested in.',
            'Improve our application’s functionality and user interface.'
        ]
    },
    {
        title: 'Data Sharing and Disclosure',
        content: [
            'We do not sell or rent your personal information to third parties. However, we may share your information with:',
            'Event Organizers: To facilitate ticket bookings and event management.',
            'Service Providers: Third-party vendors who assist us in payment processing, data analysis, and other operational functions.',
            'Legal Authorities: When required by law or to protect our rights and interests.'
        ]
    },
    {
        title: 'Data Security',
        content: [
            'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Despite our efforts, no security system is impenetrable, and we cannot guarantee the absolute security of your data.'
        ]
    },
    {
        title: 'Cookies and Tracking Technologies',
        content: [
            'Our application uses cookies and similar technologies to enhance user experience, analyze usage patterns, and deliver personalized content. You can manage your cookie preferences through your browser settings.'
        ]
    },
    {
        title: 'Third-Party Links',
        content: [
            'Our application may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.'
        ]
    },
    {
        title: 'Compliance with Local Regulations',
        content: [
            'As a company based in Agartala, Tripura, India, we adhere to the applicable state and national regulations concerning data protection and ticket booking services. We ensure that our practices align with the legal requirements to protect your privacy and rights.'
        ]
    },
    {
        title: 'Changes to This Privacy Policy',
        content: [
            'We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. We will notify you of any significant changes by posting the new policy on our application and updating the effective date.'
        ]
    },
    {
        title: 'Contact Us',
        content: [
            'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:',
            'Email: chiagartala@gmail.com',
            'Phone: +91-7005483524',
            'Address: takshakagt, Dhaleswar Kalyani, Agartala'
        ]
    }
];

export default PrivacyPolicy;