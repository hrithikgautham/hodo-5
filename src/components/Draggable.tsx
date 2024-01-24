import React, { useEffect } from 'react'
import Animated, { useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler';

const val = 70;

export const getPosition = (index) => {
  return {
    x: 10,
    y: (+index + 1) * val,
  }
}

const Draggable = ({ children, id, positions, }) => {
  const position = getPosition(positions.value[id]);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const isGestureActive = useSharedValue(false);

  useAnimatedReaction(() => positions.value[id], newOrder => {
    const getPosition = (index) => {
      return {
        x: 10,
        y: (+index + 1) * val,
      }
    }
    try {
      const newPosition = getPosition(newOrder);
      translateX.value = withTiming(newPosition.x);
      translateY.value = withTiming(newPosition.y);
    }
    catch (err) {
      console.log(err.message)
    }
  })

  const pangetstureHandler = useAnimatedGestureHandler({
    onStart: (evt, ctx) => {
      // ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      isGestureActive.value = true;
    },
    onActive: (evt, ctx) => {
      // translateX.value = ctx.startX + evt.translationX;
      const getOrder = (y) => {
        return Math.ceil((y / val) - 1);
      }
      try {
        // console.log("Hello")
        translateY.value = Math.max(ctx.startY + evt.translationY, 100);

        const oldOrder = positions.value[id];
        const newOrder = getOrder(translateY.value);
        // console.log("new Order: ", newOrder)
        if (oldOrder !== newOrder) {
          const n = Object.keys(positions.value).find(item => positions.value[item] == newOrder);
          if (n) {
            const newPositions = JSON.parse(JSON.stringify(positions.value));
            newPositions[id] = newOrder;
            newPositions[n] = oldOrder;
            positions.value = newPositions;
            // console.log(positions.value)
          }
          else {
            console.log("no need to swap...")
          }
        }
      }
      catch (err) {
        console.log(err.message)
      }

    },
    onFinish: () => {
      const getPosition = (index) => {
        return {
          x: 10,
          y: (+index + 1) * val,
        }
      }
      const { x, y } = getPosition(positions.value[id])
      translateX.value = x;
      translateY.value = y;
      isGestureActive.value = false;
    },

  });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = isGestureActive.value ? 1.1 : 1;
    const zIndex = isGestureActive.value ? 50 : 10;
    return {
      position: "absolute",
      width: "100%",
      zIndex,
      margin: 10,
      transform: [{ translateY: translateY.value, }, { scale, },]
    }
  })

  return (
    <Animated.View style={animatedStyle} >
      <PanGestureHandler onGestureEvent={pangetstureHandler}>
        <Animated.View>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}

export default Draggable