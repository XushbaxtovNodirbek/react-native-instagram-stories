import React, { FC, memo, useMemo, useState } from "react";
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";
import {
  AVATAR_SIZE,
  LOADER_ID,
  LOADER_URL,
  STROKE_WIDTH,
} from "../../core/constants";
import { StoryLoaderProps } from "../../core/dto/componentsDTO";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Loader: FC<StoryLoaderProps> = ({
  loading,
  color,
  size = AVATAR_SIZE + 10,
  count = 1,
}) => {
  const RADIUS = useMemo(() => (size - STROKE_WIDTH) / 2, [size]);
  const CIRCUMFERENCE = useMemo(() => RADIUS * 2 * Math.PI, [RADIUS]);

  const [colors, setColors] = useState<string[]>(color.value);

  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  // Har bir segment uchun bo'shliq
  const GAP_ANGLE = 10; // daraja hisobida bo'shliq
  const SEGMENT_ANGLE = useMemo(
    () => (360 - GAP_ANGLE * count) / count,
    [count]
  );
  const SEGMENT_LENGTH = useMemo(
    () => (CIRCUMFERENCE * SEGMENT_ANGLE) / 360,
    [CIRCUMFERENCE, SEGMENT_ANGLE]
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 1], [0, CIRCUMFERENCE]),
  }));

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const startAnimation = () => {
    "worklet";

    rotation.value = withRepeat(withTiming(360, { duration: 1500 }), -1, false);
    progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
  };

  const stopAnimation = () => {
    "worklet";

    cancelAnimation(rotation);
    rotation.value = withTiming(0);

    cancelAnimation(progress);
    progress.value = withTiming(0);
  };

  const onColorChange = (newColors: string[]) => {
    "worklet";

    if (JSON.stringify(colors) === JSON.stringify(newColors)) {
      return;
    }

    runOnJS(setColors)(newColors);
  };

  useAnimatedReaction(
    () => loading.value,
    (res) => (res ? startAnimation() : stopAnimation()),
    [loading.value]
  );

  useAnimatedReaction(
    () => color.value,
    (res) => onColorChange(res),
    [color.value]
  );

  // Har bir segment uchun dasharray va dashoffset hisoblash
  const segments = useMemo(() => {
    if (count < 3) {
      return [
        {
          dashArray: [CIRCUMFERENCE],
          dashOffset: 0,
          rotation: -90,
        },
      ];
    }

    const result = [];
    const gapLength = (CIRCUMFERENCE * GAP_ANGLE) / 360;

    for (let i = 0; i < count; i++) {
      const offset = i * (SEGMENT_LENGTH + gapLength);
      result.push({
        dashArray: [SEGMENT_LENGTH, CIRCUMFERENCE - SEGMENT_LENGTH],
        dashOffset: -offset,
        rotation: -90 + i * (SEGMENT_ANGLE + GAP_ANGLE),
      });
    }
    return result;
  }, [count, SEGMENT_LENGTH, CIRCUMFERENCE, SEGMENT_ANGLE, GAP_ANGLE]);

  return (
    <AnimatedSvg width={size} height={size} style={animatedStyles}>
      <Defs>
        <LinearGradient id={LOADER_ID} x1="0%" y1="0%" x2="100%" y2="0%">
          {colors?.map((item, i) => (
            <Stop key={item} offset={i / colors.length} stopColor={item} />
          ))}
        </LinearGradient>
      </Defs>
      {segments.map((segment, index) => (
        <AnimatedCircle
          key={index}
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          fill="none"
          stroke={LOADER_URL}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={segment.dashArray}
          strokeDashoffset={segment.dashOffset}
          transform={`rotate(${segment.rotation} ${size / 2} ${size / 2})`}
          animatedProps={animatedProps}
        />
      ))}
    </AnimatedSvg>
  );
};

export default memo(Loader);
