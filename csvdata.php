<?php
	function safe_GET($name,$default="") {

		return isset($_GET[$name]) ? $_GET[$name] : $default;
	}

	$year = safe_GET("year");
	$qtr = strtolower(safe_GET("qtr"));
	$industry = safe_GET("industry");
	$area = safe_GET("area");
	$size = safe_GET("size");
	$res = "";
	$rootUrl = "https://data.bls.gov/cew/data/api/";

	 if ( strlen($year) != 4) {
        echo "Invalid Year";
    }
    
    if ( strlen($qtr) > 0) {
        if( (strlen($qtr) > 1 ) or (!preg_match('/^[1-4a]/',$qtr)) ){
            echo "ERROR: Invalid quarter";
            return;
        }        
    } 
    
    if ( strlen($industry) > 0) {
        if ((strlen($industry) > 6) or (!preg_match('/^[0-9_]/', $industry)) ) {
            echo "ERROR: Invalid industry";
            return;
        }
    } 
    
    if (strlen($area) > 0) {
        if ( (strlen($area) > 5) or (!ctype_alnum($area)) ) {
            echo "ERROR: Invalid area";
            return;
        }
    }
    
    if (strlen($size) > 0) { 
        if( (strlen($size) > 1) or (!ctype_digit($size)) ) {
            echo "ERROR: Invalid size";
            return;
        }
    } 
    
    if (strlen($area) > 0 and strlen($industry) > 0) {
        echo "ERROR: Invalid input.\n";
        echo "Please provide one of the following combinations:\n";
        echo "year, qtr, industry\n";
        echo "year, qtr, area\n";
        echo "-OR-\n";
        echo "year, size\n";
        return;
    }
    
    if (strlen($size)>0 and (strlen($qtr)>0 or strlen($area)>0 or strlen($industry)>0) ) {
        echo "ERROR: Invalid input.\n";
        echo "Please provide one of the following combinations:\n";
        echo "year, qtr, industry\n";
        echo "year, qtr, area\n";
        echo "-OR-\n";
        echo "year, size\n";
        return;
    } 
    
    if (strlen($area) > 0 ) {
        // NOTE: For a complete list of area codes and titles see
        // http://data.bls.gov/cew/doc/titles/size/size_titles.htm
        $url = $rootUrl . $year . "/" . $qtr . "/area/" . $area . ".csv";
        $res = file_get_contents($url);
    } elseif (strlen($industry) > 0) {
        // NOTE: Some industry codes contain hyphens. The csv files use underbars
        // instead of hyphens, so we replace any hyphens ("-") with underbars ("_")
        // for a complete list of industry codes and titles see
        // http://data.bls.gov/cew/doc/titles/area/area_titles.htm
        $industry = str_replace("-","_",$industry);
        $url = $rootUrl . $year . "/" . $qtr . "/industry/" . $industry . ".csv";
        $res = file_get_contents($url);        
    } elseif (strlen($size) > 0 ) {
        // NOTE: Size is only available for the first quarter of each year.
        // for a complete list of size codes and titles see
        // http://data.bls.gov/cew/doc/titles/size/size_titles.htm
        $url = $rootUrl . $year . "/1/size/" . $size . ".csv";
        $res = file_get_contents($url);        
    }

    echo $res;


// NOTE: modern PHP engines will automatically insert a closing PHP marker ? and > combined.
//       So, its actually safer to NOT close it. 