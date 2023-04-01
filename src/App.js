import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Platform,
  VKCOM,
  usePlatform,
  SplitLayout
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';

const App = () => {
  const [platform, setPlatform] = useState("vkcom");
  const platformname = (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  const platformwithPlat = usePlatform();
  const isMobile = platform !== VKCOM;
  const isDesktop = !isMobile;

  const lights = ['bright_light', 'vkcom_light'];
  const [appearance, setAppearance] = useState('light');

  function useScheme(scheme, needChange = false) {
    let isLight = lights.includes(scheme);

    if (needChange) {
      isLight = !isLight;
    }
    console.log(isLight)
    setAppearance(isLight ? 'light' : 'dark');

    bridge.send('VKWebAppSetViewSettings', {
      'status_bar_style': isLight ? 'dark' : 'light',
      'action_bar_color': isLight ? '#000' : '#FFF'
    });
  }

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        useScheme(data.scheme)
      }
    });

    setPlatform(platformname ? platformwithPlat : Platform.VKCOM);
  }, []);

  return (
    <ConfigProvider appearance={appearance} platform={platform}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout activePanel={"home"}>
            <Home
              appearance={appearance}
              isDesktop={isDesktop}
              platform={platform}
            />
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;
