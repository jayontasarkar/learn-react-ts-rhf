/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

type TFormValues = {
  username: string;
  email: string;
  channel: string;
  age: number | null;
  dob: Date | null;
  social: {
    twitter: string;
    facebook: string;
    linkedin: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
};

const YouTubeForm = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting, // Check if form is submitting
      isSubmitted, // Check if form has already submitted
      isSubmitSuccessful, // Check if form submission is successfull, let's say ajax request is successfull
      submitCount, // No of times clicked on the submit button/form is submitted
    },
  } = useForm<TFormValues>({
    /**
     * Can be asynchronous
     */
    // defaultValues: async () => {
    //   const response = await fetch(
    //     'https://jsonplaceholder.typicode.com/users/1'
    //   );
    //   const user = await response.json();
    //   return {
    //     username: user?.username,
    //     email: user?.email,
    //     channel: '',
    //   };
    // },
    defaultValues: {
      username: '',
      email: '',
      channel: '',
      dob: null,
      age: null,
      social: {
        twitter: '',
        facebook: '',
        linkedin: '',
      },
      phoneNumbers: ['', ''],
      phNumbers: [{ number: '' }],
    },
    // mode: 'onBlur', // Throws error & displays immediately when focus out from an input
  });

  const {
    fields,
    append: addPhNumber,
    remove: removePhNumber,
  } = useFieldArray({
    name: 'phNumbers',
    control,
  });

  const onSubmit = async (data: TFormValues) => {
    await fetch('https://jsonplaceholder.typicode.com/users/1');
  };

  const onErrror = (errors: FieldErrors<FormData>) => {
    console.log('Errors', errors);
  };

  const handleGetValues = () => {
    console.log('getValues', getValues());
  };

  const handleSetUsernameValue = () => {
    // Third parameter optional
    setValue('username', '', {
      shouldValidate: true, // Immediately validate after setting the value
      shouldDirty: true, // Checks if field is dirty, meaning user has updated the value or not
      shouldTouch: true, // Check if user clicked in the input & then clicked outside
    });
  };

  /**
   * Watching field will rerender the component on every
   * key press on the field that will be watched.
   *
   * Without parameter will watch all properties/fields
   * Ex: const watchAllFields = watch();
   * For multiple fields to be watched,
   * Ex: const watchMultipleFields = watch(['username', 'email']);
   * For single field to be watched,
   * Ex: const watchUsername = watch('username');
   */

  /**
   * Approach 2 using useEffect
   */
  //   useEffect(() => {
  //     const subscriber = watch((value) => {
  //       console.log('Value', value);
  //     });

  //     return () => subscriber.unsubscribe();
  //   }, [watch]);

  // Reset the form on successful submission using useEffect
  //   useEffect(() => {
  //     if (isSubmitSuccessful) {
  //       reset();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [isSubmitSuccessful]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onErrror)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register('username', {
              required: {
                value: true,
                message: 'Username is required',
              },
              minLength: {
                value: 4,
                message: 'Username must be at least 4 characters long',
              },
            })}
          />
          {errors.username ? (
            <p className="error">{errors.username?.message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: {
                value: true,
                message: 'Email address is required',
              },
              pattern: {
                value: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/,
                message: 'Invalid email format',
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== 'admin@example.com' ||
                    'Enter a valid email address'
                  );
                },
                badDomain: (fieldValue) => {
                  return (
                    !fieldValue.endsWith('baddomain.com') ||
                    'This domain is not supported'
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const user = await response.json();
                  return user.length === 0 || 'Email already exists';
                },
              },
            })}
          />
          {errors.email ? (
            <p className="error">{errors.email?.message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register('channel', {
              required: { value: true, message: 'Channel is required' },
            })}
          />
          {errors.channel ? (
            <p className="error">{errors.channel?.message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register('age', {
              valueAsNumber: true,
              required: { value: true, message: 'Age is required' },
              min: { value: 18, message: 'Age must be at least 18 years' },
            })}
          />
          {errors.age ? <p className="error">{errors.age?.message}</p> : null}
        </div>
        <div className="form-control">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            {...register('dob', {
              valueAsDate: true,
              required: { value: true, message: 'Date of Birth is required' },
            })}
          />
          {errors.dob ? <p className="error">{errors.dob?.message}</p> : null}
        </div>
        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            id="facebook"
            {...register('social.facebook', {
              // Disables this field, and also disables validation for this field
              // Can be disable conditionally, let's say disable if channel is empty
              // Ex: disabled: watch('channel') === ''
              disabled: watch('channel') === '',
              required: {
                value: true,
                message: 'Facebook username is required',
              },
            })}
          />
          {errors.social?.facebook ? (
            <p className="error">{errors.social?.facebook.message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register('social.twitter', {
              required: {
                value: true,
                message: 'Twitter username is required',
              },
            })}
          />
          {errors.social?.twitter ? (
            <p className="error">{errors.social?.twitter.message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            type="text"
            id="linkedin"
            {...register('social.linkedin', {
              required: {
                value: true,
                message: 'Linkedin username is required',
              },
            })}
          />
          {errors.social?.linkedin ? (
            <p className="error">{errors.social?.linkedin.message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone</label>
          <input
            type="text"
            id="primary-phone"
            {...register('phoneNumbers.0', {
              required: {
                value: true,
                message: 'Primary phone no is required',
              },
            })}
          />
          {errors.phoneNumbers?.[0] ? (
            <p className="error">{errors.phoneNumbers?.[0].message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone</label>
          <input
            type="text"
            id="secondary-phone"
            {...register('phoneNumbers.1', {
              required: {
                value: true,
                message: 'Secondary phone no is required',
              },
            })}
          />
          {errors.phoneNumbers?.[1] ? (
            <p className="error">{errors.phoneNumbers?.[1].message}</p>
          ) : null}
        </div>
        <div className="form-control">
          <h3>List of Phone Numbers</h3>
          <div>
            {fields.map((field, index) => (
              <div className="form-control" key={`phone-${field.id}`}>
                <label htmlFor={`phn-${index}`}>Phone No #{index + 1}</label>
                <input
                  type="text"
                  id={`phn-${index}`}
                  {...register(`phNumbers.${index}.number` as const, {
                    required: {
                      value: true,
                      message: `Phone no ${index + 1} is required`,
                    },
                  })}
                />
                {index > 0 && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      removePhNumber(index);
                    }}
                  >
                    Remove
                  </a>
                )}
                {errors.phNumbers?.[index]?.number?.message ? (
                  <p className="error">
                    {errors.phNumbers?.[index]?.number?.message}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                addPhNumber({ number: '' });
              }}
            >
              Add Phone Numbers
            </a>
          </div>
        </div>
        <button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? 'Submitting' : 'Submit'}
        </button>
        &nbsp;&nbsp;
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
        <br />
        <br />
        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>
        &nbsp;&nbsp;
        <button type="button" onClick={handleSetUsernameValue}>
          Set Value
        </button>
        <br />
        <br />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            // Manually trigger validation
            // If no parameter passed, validate all fields
            // Ex: trigger();
            trigger(['username', 'email']);
          }}
        >
          Manually Trigger
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;
