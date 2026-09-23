package com.PgPeekIn.Backend.Service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SupabaseService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    private final RestTemplate restTemplate = new RestTemplate();


    public String uploadImage(MultipartFile image, Long pgid) throws IOException {

        System.out.println("========== SUPABASE UPLOAD START ==========");

        System.out.println("Image name: " + image.getOriginalFilename());
        System.out.println("Image size: " + image.getSize());
        System.out.println("PG ID: " + pgid);


        String fileName = UUID.randomUUID()
                + "-"
                + image.getOriginalFilename();

        String filePath = "pg/"
                + pgid
                + "/"
                + fileName;


        String uploadUrl = supabaseUrl
                + "/storage/v1/object/pg-images/"
                + filePath;


        System.out.println("Upload URL: " + uploadUrl);


        HttpHeaders headers = new HttpHeaders();

        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey);

        // CHANGE: image.getContentType() can be null (some clients don't send
        // it for a file part). Passing null into MediaType.parseMediaType()
        // throws immediately, before the request is even sent — this looked
        // exactly like an "upload failure" but never reached Supabase at all.
        // Fall back to a generic binary type when it's missing.
        MediaType contentType = (image.getContentType() != null)
                ? MediaType.parseMediaType(image.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM;

        headers.setContentType(contentType);

        System.out.println("Content-Type used: " + contentType);


        HttpEntity<byte[]> request = new HttpEntity<>(
                image.getBytes(),
                headers
        );


        try {

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    request,
                    String.class
            );


            System.out.println(
                    "Supabase status: "
                    + response.getStatusCode()
            );

            System.out.println(
                    "Supabase response: "
                    + response.getBody()
            );


            String imageUrl = supabaseUrl
                    + "/storage/v1/object/public/pg-images/"
                    + filePath;


            System.out.println("Image URL: " + imageUrl);

            System.out.println("========== SUPABASE UPLOAD SUCCESS ==========");

            return imageUrl;

        } catch (Exception e) {

            System.out.println("========== SUPABASE UPLOAD FAILED ==========");

            System.out.println("Error: " + e.getMessage());

            e.printStackTrace();

            throw e;
        }
    }
}
