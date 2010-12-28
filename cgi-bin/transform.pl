#!/usr/bin/perl

use XML::LibXSLT;
use XML::LibXML;

my $parser = XML::LibXML->new();
my $xslt   = XML::LibXSLT->new();

my $source = $parser->parse_file('a-network.svg');
my $style_doc = $parser->parse_file('svg-add-fun.xsl');

my$ stylesheet = $xslt->parse_stylesheet($style_doc);

my $result = $stylesheet->transform($source);

print $stylesheet->output_string($result);

