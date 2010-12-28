#!/usr/bin/perl


#
# File: hostToIP.pl
#
# Author: Steve Eriksson - steve.eriksson@gmail.com
# 
# Returns the ip adress of a host in the Telenor network 
#

use strict;
use warnings;
use Socket;
use CGI;

my $cgi = new CGI;
my $domain = '.ti.telenor.net';
my $hostname = $cgi->param( 'host' );

$hostname = $hostname . $domain;

my $address = inet_aton( $hostname );

print $cgi->header();

if ($address) {
  print $hostname, " has IP address: ", inet_ntoa( $address );
} else {
  print "Did not find IP adress for host: ", $hostname;
}
