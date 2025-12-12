import React, { useState } from 'react';
import { SmartForm, FormSchema } from '@reactai/smartform';

interface SmartFormDemoProps {
  apiKey: string;
}

const formSchema: FormSchema = {
  name: {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    minLength: 2,
  },
  email: {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    required: true,
    aiValidation: true,
  },
  phone: {
    name: 'phone',
    type: 'phone',
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    aiValidation: true,
  },
  message: {
    name: 'message',
    type: 'textarea',
    label: 'Message',
    placeholder: 'Tell us about your project...',
    minLength: 10,
  },
};

export const SmartFormDemo: React.FC<SmartFormDemoProps> = ({ apiKey }) => {
  const [values, setValues] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (formValues: Record<string, string>) => {
    console.log('Form submitted:', formValues);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ● Live Demo
        </span>
        <span className="text-sm text-slate-500">Fill out the form below</span>
      </div>

      {submitted ? (
        <div className="p-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl text-center shadow-lg">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold">Form Submitted Successfully!</h3>
          <p className="mt-2 text-white/90">Thank you for your submission.</p>
        </div>
      ) : (
        <SmartForm
          schema={formSchema}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          provider="openai"
          apiKey={apiKey}
          aiValidation={true}
          autoCorrect={false}
          submitText="Submit Form"
        />
      )}

      <div className="mt-6 p-4 bg-slate-100 rounded-xl">
        <p className="text-sm font-semibold text-slate-700 mb-2">💡 Features:</p>
        <ul className="text-sm text-slate-600 space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> AI-powered field validation
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Smart error messages with suggestions
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Auto-correction on blur (optional)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Real-time validation feedback
          </li>
        </ul>
      </div>
    </div>
  );
};

