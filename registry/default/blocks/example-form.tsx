import { revalidateLogic } from '@tanstack/react-form';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import { useAppForm } from '@/components/ui/form';

const formSchema = z.object({
});

function ExampleForm() {
  const form = useAppForm({
    validationLogic: revalidateLogic(),
    // validators: {
    //   onDynamic: formSchema,
    // },
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      instagramHandle: '',
      has3dPrinter: false,
      hasSolderingEquipment: false,
      whyDoYouWantToBeATester: '',
      howDidYouHearAboutUs: '',
      acceptRecievingEmail: false,
      website: '',
      humanCheck: '',
    },
  });

  return (
    <form
      className='relative space-y-8'
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
      <form.AppForm>
        <form.AppField name='name'>
          {(field) => (
            <field.TextField
              label='Name'
              placeholder='Your name'
              autoComplete='name'
            />
          )}
        </form.AppField>
        <form.AppField name='email'>
          {(field) => (
            <field.TextField
              label='Email'
              placeholder='you@email.com'
              autoComplete='email'
            />
          )}
        </form.AppField>
        <form.AppField name='phoneNumber'>
          {(field) => (
            <field.PhoneField
              label='Phone Number'
              placeholder='+1234567890'
              autoComplete='tel'
            />
          )}
        </form.AppField>
        <form.AppField name='instagramHandle'>
          {(field) => (
            <field.TextField
              label='Instagram Handle'
              placeholder='@yourhandle'
            />
          )}
        </form.AppField>
        <form.AppField name='has3dPrinter'>
          {(field) => (
            <field.CheckboxField label='Do you have access to a 3D printer?' />
          )}
        </form.AppField>
        <form.AppField name='hasSolderingEquipment'>
          {(field) => (
            <field.CheckboxField label='Do you have access to soldering equipment?' />
          )}
        </form.AppField>
        <form.AppField name='whyDoYouWantToBeATester'>
          {(field) => (
            <field.TextAreaField
              label='Why do you want to be a tester?'
              placeholder='Let us know why you are interested'
            />
          )}
        </form.AppField>
        <form.AppField name='howDidYouHearAboutUs'>
          {(field) => (
            <field.SelectField
              label='How did you hear about us?'
              options={[
                { value: 'tiktok', label: 'TikTok' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'youtube', label: 'YouTube' },
                { value: 'linkedin', label: 'LinkedIn' },
                { value: 'email', label: 'Email' },
                { value: 'friend', label: 'Friend' },
                { value: 'other', label: 'Other' },
              ]}
            />
          )}
        </form.AppField>
        <form.AppField name='acceptRecievingEmail'>
          {(field) => (
            <field.CheckboxField label='I accept receiving emails about my application' />
          )}
        </form.AppField>
        <form.AppField name='website'>
          {(field) => (
            <field.TextField
              className='hidden'
              tabIndex={-1}
              autoComplete='off'
            />
          )}
        </form.AppField>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
          <div className='w-full flex-1'>
            <form.AppField name='humanCheck'>
              {(field) => (
                <field.TextField
                  label="To prove you’re human, type the magic word: 'fish' 🐟"
                  placeholder="Type 'fish'"
                />
              )}
            </form.AppField>
          </div>
          <div className='w-full sm:w-auto'>
            <form.SubmitButton
              className='mb-2 w-full min-w-32 sm:w-auto'
            >
              Submit
            </form.SubmitButton>
          </div>
        </div>
      </form.AppForm>
    </form>
  );
}

export { ExampleForm };
