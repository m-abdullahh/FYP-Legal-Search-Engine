<?php
/*
Plugin Name: Legal Chatbotsss
Description: Integrates a React-based legal chatbot into WordPress
Version: 1.0
Author: Your Name
*/

// Function to insert the chatbot container
function insert_chatbot_container() {
    // Path to your Vite build index.html
    $index_path = plugin_dir_path(__FILE__) . 'dist/index.html';
    
    if (file_exists($index_path)) {
        // Read the contents of index.html
        $html_content = file_get_contents($index_path);
        
        // Update asset paths in the HTML content
        $plugin_url = plugin_dir_url(__FILE__) . 'dist/';
        $html_content = str_replace('/assets/', $plugin_url, $html_content);
        
        // Output the modified HTML
        echo $html_content;
    }
}
add_action('wp_footer', 'insert_chatbot_container');

// Function to enqueue scripts and styles
function enqueue_legal_chatbot_scripts() {
    // Adjust paths for dist folder
    $plugin_dist_url = plugin_dir_url(__FILE__) . 'dist/';
    
    wp_enqueue_script('legal-chatbot-js', $plugin_dist_url . 'chatbot.js', array(), '1.0', true);
    wp_enqueue_style('legal-chatbot-css', $plugin_dist_url . 'chatbot.css');
}
add_action('wp_enqueue_scripts', 'enqueue_legal_chatbot_scripts');
