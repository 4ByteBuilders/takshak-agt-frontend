// PhoneNumberInput.tsx
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useState, ChangeEvent, useEffect } from "react";

interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
    value,
    onChange,
    error,
}) => {
    // Manage the country code separately (user selects from these options).
    const [countryCode, setCountryCode] = useState("+91");

    // Extract the local number from the combined value.
    const localNumber = value.startsWith(countryCode)
        ? value.slice(countryCode.length)
        : value;

    // When the country code changes, update the full phone number.
    const handleCountryCodeChange = (newCode: string) => {
        setCountryCode(newCode);
        onChange(newCode + localNumber);
    };

    // When the local number changes, allow only digits and restrict the input to 10 characters.
    const handleLocalNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
        onChange(countryCode + digits);
    };

    // Keep the local number in sync if the parent value changes externally.
    useEffect(() => {
        if (value && !value.startsWith(countryCode)) {
            onChange(countryCode + value.slice(countryCode.length));
        }
    }, [value, countryCode, onChange]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex gap-2">
                <Select value={countryCode} onValueChange={handleCountryCodeChange}>
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="+1">+1 (US)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                        <SelectItem value="+91">+91 (India)</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={localNumber}
                    onChange={handleLocalNumberChange}
                    maxLength={10} // Limit the local number to 10 digits.
                    className="input input-bordered flex-1"
                />
            </div>
            {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
    );
};

export default PhoneNumberInput;
