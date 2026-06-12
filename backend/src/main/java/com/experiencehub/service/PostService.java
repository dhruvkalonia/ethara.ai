package com.experiencehub.service;

import com.experiencehub.dto.CreatePostRequest;
import com.experiencehub.dto.PostResponse;
import com.experiencehub.exception.BadRequestException;
import com.experiencehub.exception.ResourceNotFoundException;
import com.experiencehub.model.Post;
import com.experiencehub.model.PostStatus;
import com.experiencehub.model.User;
import com.experiencehub.repository.PostRepository;
import com.experiencehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostResponse createPost(String userEmail, CreatePostRequest request) {
        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getStatus() == PostStatus.ARCHIVED) {
            throw new BadRequestException("Cannot create a post with ARCHIVED status");
        }

        Post post = Post.builder()
                .authorId(author.getId())
                .authorName(author.getName())
                .authorUsername(author.getUsername())
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory())
                .tags(normalizeTags(request.getTags()))
                .location(trimOrNull(request.getLocation()))
                .status(request.getStatus())
                .build();

        post = postRepository.save(post);
        log.info("Post created: {} by {}", post.getId(), author.getEmail());
        return toResponse(post);
    }

    public Page<PostResponse> getPublishedPosts(Pageable pageable) {
        return postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED, pageable)
                .map(this::toResponse);
    }

    public PostResponse getPublishedPost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getStatus() != PostStatus.PUBLISHED) {
            throw new ResourceNotFoundException("Post not found");
        }

        return toResponse(post);
    }

    public Page<PostResponse> getMyPosts(String userEmail, Pageable pageable) {
        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return postRepository.findByAuthorIdOrderByCreatedAtDesc(author.getId(), pageable)
                .map(this::toResponse);
    }

    private List<String> normalizeTags(List<String> tags) {
        if (tags == null) {
            return Collections.emptyList();
        }
        return tags.stream()
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .distinct()
                .limit(10)
                .toList();
    }

    private String trimOrNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private PostResponse toResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .authorId(post.getAuthorId())
                .authorName(post.getAuthorName())
                .authorUsername(post.getAuthorUsername())
                .title(post.getTitle())
                .description(post.getDescription())
                .category(post.getCategory())
                .tags(post.getTags())
                .location(post.getLocation())
                .status(post.getStatus())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
