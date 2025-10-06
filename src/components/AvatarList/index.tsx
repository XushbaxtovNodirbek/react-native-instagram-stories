import React, { FC, memo } from "react";
import { ScrollView } from "react-native";
import StoryAvatar from "../Avatar";
import { StoryAvatarListProps } from "../../core/dto/componentsDTO";
import { InstagramStoryProps } from "../../core/dto/instagramStoriesDTO";

const StoryAvatarList: FC<StoryAvatarListProps> = ({
  stories,
  loadingStory,
  seenStories,
  colors,
  seenColors,
  size,
  showName,
  nameTextStyle,
  nameTextProps,
  avatarListContainerProps,
  avatarListContainerStyle,
  avatarBorderRadius,
  onPress,
}) => {
  const renderItem = (story: InstagramStoryProps) => (
    <StoryAvatar
      {...story}
      loadingStory={loadingStory}
      seenStories={seenStories}
      onPress={() => onPress(story.id)}
      colors={colors}
      seenColors={seenColors}
      size={size}
      showName={showName}
      nameTextStyle={nameTextStyle}
      nameTextProps={nameTextProps}
      avatarBorderRadius={avatarBorderRadius}
      key={`avatar${story.id}`}
    />
  );

  return (
    <ScrollView
      horizontal
      {...avatarListContainerProps}
      contentContainerStyle={avatarListContainerStyle}
      testID="storiesList"
    >
      {stories.map(renderItem)}
    </ScrollView>
  );
};

export default memo(StoryAvatarList);
