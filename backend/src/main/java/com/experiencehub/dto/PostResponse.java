package com.experiencehub.dto;

import com.experiencehub.model.PostCategory;
import com.experiencehub.model.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private String id;
    private String authorId;
    private String authorName;
    private String authorUsername;
    private String title;
    private String description;
    private PostCategory category;
    private List<String> tags;
    private String location;
    private PostStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
