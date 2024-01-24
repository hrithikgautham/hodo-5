import React, {useState, useEffect, useContext, createContext} from 'react'
import MyToast from '../components/MyToast'
import {ToastProvider, ToastViewport} from '@tamagui/toast'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {VIEWPORT_NAME} from '../constants/contants'

const toastContext = createContext()

export function ToastController({children}) {
  const {left, top, right} = useSafeAreaInsets();

  const [openToast, setOpenToast] = useState(false);
  const [toastDescription, setToastDescription] = useState("");
  const [toastType, setToastType] = useState("");

  function showToast(description, type = "") {
    setToastDescription(description);
    setToastType(type);
    setOpenToast(true);
  }

  return <toastContext.Provider value={{
    showToast,
  }}>
    <ToastProvider duration={5000} swipeDirection="horizontal">
      {children}
      <MyToast open={openToast} setOpen={setOpenToast} description={toastDescription} type={toastType} />
      <ToastViewport top={top} left={left} right={right} multipleToasts name={VIEWPORT_NAME} />
    </ToastProvider>
  </toastContext.Provider>
}

export const useToast = () => {
  return useContext(toastContext);
}
