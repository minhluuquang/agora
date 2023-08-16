import { CreditCard, Settings, User } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

import { useEffect, useRef, useState } from 'react';
import { cn } from './lib/utils';

export function App() {
  const [isOpen, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: MouseEvent) => {
    if (containerRef && containerRef.current) {
      if (!event.composedPath().includes(containerRef.current)) {
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('click', handleKeyDown);
    };
  }, [containerRef]);

  // states for port and tabs
  const [port, setPort] = useState<chrome.runtime.Port>();
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

  // init port and current tabs
  useEffect(() => {
    const p = chrome.runtime.connect({ name: 'tabs' });
    p.postMessage({ action: 'getTabs' });
    p.onMessage.addListener(function (msg) {
      if (msg.name === 'allTabs') {
        setTabs(msg.data);
      }
    });
    chrome.runtime.onMessage.addListener(function (msg) {
      if (msg.name === 'open-agora') {
        setOpen(true);
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }
    });
    setPort(p);
  }, []);

  return (
    <div ref={containerRef} className={(cn('w-96'), isOpen ? '' : 'hidden')}>
      <Command className='rounded-lg border shadow-md'>
        <CommandInput
          ref={inputRef}
          placeholder='Type a command or search...'
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Tabs'>
            {tabs.map((tab) => {
              return (
                <CommandItem
                  onSelect={() => {
                    port?.postMessage({
                      action: 'selectTab',
                      data: tab,
                    });
                  }}
                  key={tab.id}
                  value={
                    (tab?.id?.toString() ?? '') + (tab?.title?.toString() ?? '')
                  }
                >
                  {tab.favIconUrl ? (
                    <img src={tab.favIconUrl} className='mr-2 h-4 w-4' />
                  ) : (
                    <User className='mr-2 h-4 w-4' />
                  )}
                  <div className='w-full flex justify-between'>
                    <span>{tab.title}</span>
                    <span>tab</span>
                  </div>
                  {/* <CommandShortcut>⌘{tab.id}</CommandShortcut> */}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Settings'>
            <CommandItem>
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className='mr-2 h-4 w-4' />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export default App;
