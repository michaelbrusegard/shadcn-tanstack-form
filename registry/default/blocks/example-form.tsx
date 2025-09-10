"use client";

import { revalidateLogic } from '@tanstack/react-form';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import { useAppForm } from '@/components/ui/form';

const formSchema = z.object({
  textField: z.string().min(2, 'Text field must be at least 2 characters.'),
  numberField: z
    .number(),
  textAreaField: z.string().min(10, 'Textarea must be at least 10 characters.'),
  selectField: z.enum(['apple', 'orange', 'peach', 'melon'], { required_error: 'Please select an option.' }),
  radioGroupField: z.enum(['fiat', 'ferrari', 'astonMartin', 'mercedes'], { required_error: 'Please select a car.' }),
  checkboxField: z.boolean().refine((val) => val === true, {
    message: 'You must accept the checkbox.'
  }),
  phoneField: z.string().refine(isValidPhoneNumber, 'Invalid phone number'),
  fieldProps: z.string(),
});

function ExampleForm() {
  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    defaultValues: {
      textField: '',
      numberField: NaN,
      textAreaField: '',
      selectField: '',
      radioGroupField: '',
      checkboxField: false,
      phoneField: '',
      fieldProps: '',
    },
  });

  return (
    <form
      className='relative space-y-8 my-8'
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
      <form.AppForm>
        <form.AppField name='textField'>
          {(field) => (
            <field.TextField
              label='Text field example'
              placeholder='This is some placeholder text'
            />
          )}
        </form.AppField>
        <form.AppField name='fieldProps'>
          {(field) => (
            <field.TextField
              label='Field props example'
              placeholder='This is some placeholder text'
              description='This is some description text and can be added to most fields with a prop.'
              fieldSuffix=<span className='text-xs ml-2'>A ReactNode field suffix prop</span>
              labelSibling=<span className='text-xs ml-2'>A ReactNode label sibling prop</span>
            />
          )}
        </form.AppField>
        <form.AppField name='numberField'>
          {(field) => (
            <field.NumberField
              label='Number field example'
              placeholder='12345'
            />
          )}
        </form.AppField>
        <form.AppField name='textAreaField'>
          {(field) => (
            <field.TextAreaField
              label='Textarea field example'
              placeholder='here you can write a longer text'
            />
          )}
        </form.AppField>
        <form.AppField name='selectField'>
          {(field) => (
            <field.SelectField
              label='Select field example'
              placeholder='Select something'
              options={[
                { value: 'apple', label: 'Apple' },
                { value: 'orange', label: 'Orange' },
                { value: 'peach', label: 'Peach' },
                { value: 'melon', label: 'Melon' },
              ]}
            />
          )}
        </form.AppField>
        <form.AppField name='radioGroupField'>
          {(field) => (
            <field.RadioGroupField
              label='Radio group field example'
              options={[
                { value: 'fiat', label: 'Fiat' },
                { value: 'ferrari', label: 'Ferrari' },
                { value: 'astonMartin', label: 'Aston Martin' },
                { value: 'mercedes', label: 'Mercedes' },
              ]}
            />
          )}
        </form.AppField>
        <form.AppField name='checkboxField'>
          {(field) => (
            <field.CheckboxField
              label='Checkbox field example'
            />
          )}
        </form.AppField>
        <form.AppField name='phoneField'>
          {(field) => (
            <field.PhoneField
              label='Phone field example'
              placeholder='123 45 678'
            />
          )}
        </form.AppField>
        <form.SubmitButton
          className='mb-2 w-full min-w-32 sm:w-auto'
        >
          Submit Button
        </form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

export { ExampleForm };
