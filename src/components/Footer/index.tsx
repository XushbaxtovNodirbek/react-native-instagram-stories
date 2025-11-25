import React, { FC, memo, useState, useMemo, useEffect } from "react";
import { View } from "react-native";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { StoryContentProps } from "../../core/dto/componentsDTO";
import ContentStyles from "./Footer.styles";

const StoryFooter: FC<StoryContentProps> = ({
  stories,
  active,
  activeStory,
}) => {
  const [storyIndex, setStoryIndex] = useState(0);

  // Initialize with the first story's like count
  const [likeCount, setLikeCount] = useState(stories[0]?.likes || 0);

  const onChange = async () => {
    "worklet";
    const index = stories.findIndex((item) => item.id === activeStory.value);
    if (active.value && index >= 0 && index !== storyIndex) {
      runOnJS(setStoryIndex)(index);
    }
  };

  // Update like count when story changes
  useEffect(() => {
    const currentStory = stories[storyIndex];
    if (currentStory?.likes !== undefined) {
      setLikeCount(currentStory.likes);
    }
  }, [storyIndex, stories]);

  useAnimatedReaction(
    () => active.value,
    (res, prev) => res !== prev && onChange(),
    [active.value, onChange]
  );

  useAnimatedReaction(
    () => activeStory.value,
    (res, prev) => res !== prev && onChange(),
    [activeStory.value, onChange]
  );

  const incrementLike = () => {
    setLikeCount((prevCount) => prevCount + 1);
  };

  // Include likeCount in the dependency array so footer re-renders when it changes
  const footer = useMemo(() => {
    const currentStory = stories[storyIndex];
    if (!currentStory?.renderFooter) return null;

    // Pass likeCount and incrementLike to the footer
    return currentStory.renderFooter({ likeCount, incrementLike });
  }, [storyIndex, likeCount, incrementLike]);

  return footer ? (
    <View style={ContentStyles.container} pointerEvents="box-none">
      {footer}
    </View>
  ) : null;
};

export default memo(StoryFooter);
