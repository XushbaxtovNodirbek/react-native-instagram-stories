import React, { FC, memo } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { StoryAvatarProps } from "../../core/dto/componentsDTO";
import AvatarStyles from "./Avatar.styles";
import Loader from "../Loader";
import { AVATAR_OFFSET } from "../../core/constants";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const StoryAvatar: FC<StoryAvatarProps> = ({
  id,
  avatarSource,
  name,
  stories,
  loadingStory,
  seenStories,
  onPress,
  colors,
  seenColors,
  size,
  showName,
  nameTextStyle,
  nameTextProps,
  renderAvatar,
  avatarBorderRadius,
}) => {
  const loaded = useSharedValue(false);
  const isLoading = useDerivedValue(
    () => loadingStory.value === id || !loaded.value
  );
  const seen = useDerivedValue(
    () => seenStories.value[id] === stories[stories.length - 1]?.id
  );
  const loaderColor = useDerivedValue(() => (seen.value ? seenColors : colors));

  const onLoad = () => {
    loaded.value = true;
  };

  const imageAnimatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isLoading.value ? 0.5 : 1),
  }));

  if (renderAvatar) {
    return renderAvatar(seen.value);
  }

  if (!avatarSource) {
    return null;
  }

  const borderRadius = avatarBorderRadius ?? size / 2;

  return (
    <View style={AvatarStyles.name}>
      <View style={AvatarStyles.container}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onPress}
          testID={`${id}StoryAvatar${stories.length}Story`}
        >
          <Loader
            count={stories.length}
            loading={isLoading}
            color={loaderColor}
            size={size + AVATAR_OFFSET * 2}
          />

          <LinearGradient
            colors={["#D86CFF", "#223BA6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              width: size,
              height: size,
              borderRadius: borderRadius,
              position: "absolute",
              top: AVATAR_OFFSET,
              left: AVATAR_OFFSET,
            }}
          />

          <AnimatedImage
            source={avatarSource}
            style={[
              AvatarStyles.avatar,
              imageAnimatedStyles,
              {
                width: size,
                height: size,
                borderRadius: borderRadius,
              },
            ]}
            testID="storyAvatarImage"
            onLoad={onLoad}
          />
        </TouchableOpacity>
      </View>
      {Boolean(showName) && (
        <Text
          {...nameTextProps}
          style={[{ width: size + AVATAR_OFFSET * 2 }, nameTextStyle]}
        >
          {name}
        </Text>
      )}
    </View>
  );
};

export default memo(StoryAvatar);
