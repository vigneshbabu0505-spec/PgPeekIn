package com.PgPeekIn.Backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class TenantSupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final RestClient restClient = RestClient.create();

    public String uploadImage(MultipartFile file) throws Exception {

        String originalName = file.getOriginalFilename();

        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(
                    originalName.lastIndexOf(".")
            );
        }

        String fileName = UUID.randomUUID() + extension;

        String uploadUrl =
                supabaseUrl +
                        "/storage/v1/object/" +
                        bucket +
                        "/" +
                        fileName;

        restClient.post()
                .uri(uploadUrl)
                .header("Authorization", "Bearer " + supabaseKey)
                .header("apikey", supabaseKey)
                .contentType(
                        MediaType.parseMediaType(file.getContentType())
                )
                .body(file.getBytes())
                .retrieve()
                .toBodilessEntity();

        return supabaseUrl +
                "/storage/v1/object/public/" +
                bucket +
                "/" +
                fileName;
    }
}