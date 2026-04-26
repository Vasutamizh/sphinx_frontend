import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconBookmark,
  IconEdit,
  IconListDetails,
  IconPercentage,
  IconQuestionMark,
  IconTrash,
} from "@tabler/icons-react";

export default function TopicCard({
  topic,
  onEdit,
  onDelete,
  onViewQuestions,
  className,
}) {
  const {
    id,
    topicId,
    percentage,
    passPercentage,
    questionsCount,
    savePermanently,
  } = topic;

  // Determine color based on percentage (optional visual flair)
  const percentageColor =
    percentage >= 70 ? "teal" : percentage >= 40 ? "blue" : "orange";

  return (
    <Card
      withBorder
      radius="md"
      padding="lg"
      shadow="sm"
      miw="350px"
      style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)";
      }}
      className={className}
    >
      <Stack gap="md">
        {/* Header: Topic topicId & Template Badge */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon variant="light" color="blue" size="md" radius="xl">
              <IconBookmark size={16} />
            </ThemeIcon>
            <Text fw={700} size="lg" c="blue.8">
              {topicId}
            </Text>
            {savePermanently && (
              <Badge variant="light" color="grape" size="sm" leftSection="📁">
                Permanent
              </Badge>
            )}
          </Group>
        </Group>

        <Divider my="xs" />

        {/* Details Grid with captions */}
        <Grid gutter="md">
          {/* percentage with Progress Bar */}
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Group gap="xs" align="flex-start">
              <ThemeIcon
                variant="transparent"
                color={percentageColor}
                size="sm"
              >
                <IconPercentage size={18} />
              </ThemeIcon>
              <Stack gap={4} style={{ flex: 1 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  percentage
                </Text>
                <Text fw={700} size="xl" c={percentageColor}>
                  {percentage}%
                </Text>
                <Progress
                  value={percentage}
                  color={percentageColor}
                  size="sm"
                  animated
                />
              </Stack>
            </Group>
          </Grid.Col>

          {/* Questions Count */}
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Group gap="xs">
              <ThemeIcon variant="transparent" color="violet" size="sm">
                <IconQuestionMark size={18} />
              </ThemeIcon>
              <Stack gap={4}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Questions
                </Text>
                <Text fw={700} size="xl" c="violet.7">
                  {questionsCount}
                </Text>
                <Text size="xs" c="dimmed">
                  total in this topic
                </Text>
              </Stack>
            </Group>
          </Grid.Col>

          {/* Pass Percentage (if set) */}
          {passPercentage !== undefined && (
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Group gap="xs">
                <ThemeIcon variant="transparent" color="green" size="sm">
                  <IconListDetails size={18} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Pass Requirement
                  </Text>
                  <Text fw={700} size="xl" c="green.7">
                    {passPercentage}%
                  </Text>
                  <Text size="xs" c="dimmed">
                    to clear this topic
                  </Text>
                </Stack>
              </Group>
            </Grid.Col>
          )}
        </Grid>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="xs" mt="sm">
          <Tooltip zIndex={100000} label="View / Add Questions" position="top">
            <ActionIcon
              variant="light"
              color="blue"
              size="md"
              radius="xl"
              onClick={() => onViewQuestions?.(id)}
            >
              <IconListDetails size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip zIndex={100000} label="Edit Topic" position="top">
            <ActionIcon
              variant="light"
              color="gray"
              size="md"
              radius="xl"
              onClick={() => onEdit?.(id)}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip zIndex={100000} label="Delete Topic" position="top">
            <ActionIcon
              variant="light"
              color="red"
              size="md"
              radius="xl"
              onClick={() => onDelete?.(id)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
}
