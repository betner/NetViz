#!/usr/bin/perl
use strict;
use warnings;
use CGI;

my $cgi = new CGI;
my $domain = '.ti.telenor.net';
my $hostname = $cgi->param( 'host' );

$hostname = $hostname . $domain;

print $cgi->header();
print $param, " performed AJAX call";
