<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function dir_contents_recursive($start, $dir, $file_hierarchy) {
    // open handler for the directory
    $iter = new DirectoryIterator($start.$dir);

    foreach( $iter as $item ) {
        // make sure you don't try to access the current dir or the parent
        if ($item != '.' && $item != '..') {
            if( $item->isDir() ) {
                // call the function on the folder
                $file_hierarchy = dir_contents_recursive($start, "$dir/$item", $file_hierarchy);
            } else {
                // print files
                $file_hierarchy[] = $dir . "/" .$item->getFilename() . "\n";
            }
        }
    }

    return $file_hierarchy;
}

$file_hierarchy = dir_contents_recursive("..", "/files", array());
echo json_encode($file_hierarchy);

?>
