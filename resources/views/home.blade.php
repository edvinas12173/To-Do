@extends('layouts.app')

@section('content')
    <app :id={{ Auth::user()->id }}></app>
@endsection
