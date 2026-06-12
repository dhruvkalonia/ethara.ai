package com.experiencehub.dto;

import com.experiencehub.model.PostCategory;
import com.experiencehub.model.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreatePostRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 10000, message = "Description must be between 20 and 10000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private PostCategory category;

    private List<String> tags;

    private String location;

    @NotNull(message = "Status is required")
    private PostStatus status;
}
