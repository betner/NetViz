#!/usr/bin/perl
use warnings;
use strict;

use XML::LibXSLT;
use XML::LibXML;
use CGI;

my $cgi = new CGI;
my $svg_file = $cgi->param( "network" );

if (! -e $svg_file) {
  print $cgi->header(); 
  print $cgi->start_html( -title => "File not found" );
  print $cgi->h1( "Error: file for network \"$svg_file\" doesn't exist" );
  print $cgi->end_html();
} else {
  my $xsl_file = "svgAddBindings.xsl";

  my $parser = XML::LibXML->new();
  my $xslt   = XML::LibXSLT->new();

  my $source    = $parser->parse_file( $svg_file );
  my $style_doc = $parser->parse_file( $xsl_file );

  my $stylesheet = $xslt->parse_stylesheet( $style_doc );

  my $result = $stylesheet->transform( $source );

  print $cgi->header( "image/svg+xml" );
  print $stylesheet->output_string( $result );
}
