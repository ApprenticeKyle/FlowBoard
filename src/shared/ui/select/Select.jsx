import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

export const Select = ({
  value,
  onChange,
  options = [],
  className,
  placeholder = 'Select...',
  disabled = false,
}) => {
  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={clsx(
            'w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-300 outline-none cursor-pointer hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between',
            className
          )}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-2 w-full bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  clsx(
                    'relative cursor-pointer select-none py-2.5 px-4 text-sm transition-colors',
                    active ? 'bg-white/10 text-white' : 'text-slate-300'
                  )
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span className={clsx('block truncate', selected ? 'font-semibold' : 'font-normal')}>
                      {option.label}
                    </span>
                    {selected && (
                      <Check className="w-4 h-4 text-primary-400" />
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

