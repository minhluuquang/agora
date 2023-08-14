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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useEffect, useState } from 'react';

export function App() {
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
    setPort(p);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      port?.postMessage({ action: 'getTabs' });
      port?.onMessage.addListener(function (msg) {
        if (msg.name === 'allTabs') {
          setTabs(msg.data);
        }
      });
    }, 5000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <div className='w-96'>
      <Command className='rounded-lg border shadow-md '>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Tabs'>
            {tabs.map((tab) => {
              return (
                <CommandItem
                  onSelect={() => {
                    port?.postMessage({ action: 'selectTab', data: tab });
                  }}
                  key={tab.id}
                  value={tab.id?.toString()}
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
