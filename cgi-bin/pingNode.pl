#!/usr/bin/perl

#
# File: pingNode.pl
#
# Author: Steve Eriksson - steve.eriksson@gmail.com
# 
# CGI script that pings a node in the Telenor network.
#

use strict;
use warnings;
use Net::Ping;
use CGI;

my $cgi = new CGI;
my $domain = '.ti.telenor.net';
my $hostname = $cgi->param( 'host' );

$hostname = $hostname . $domain;

# use UDP to ping node since ICMP usually requires root priviliges
my $ping = Net::Ping->new( 'udp' );
my $result = $ping->ping( $hostname );

print $cgi->header();

if ($result) {
  print $hostname, ' is alive';
} else {
  print $hostname, ' is not alive';
}

