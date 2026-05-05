import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ViewPosts() {
  const [lostPosts, setLostPosts] = useState([]);
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      setError('');

      const { data: lostData, error: lostError } = await supabase
        .from('lost_items')
        .select(`
          lost_item_id,
          status,
          Items (
            item_id,
            created_at,
            Item_Names ( name ),
            Colors ( color ),
            Locations ( location )
          )
        `)
        .order('lost_item_id', { ascending: false });

      if (lostError) {
        console.error('Lost posts error:', lostError);
        setError(lostError.message);
        return;
      }

      const { data: foundData, error: foundError } = await supabase
        .from('Found_Items')
        .select(`
          found_item_id,
          status,
          Items (
            item_id,
            created_at,
            Item_Names ( name ),
            Colors ( color ),
            Locations ( location )
          )
        `)
        .order('found_item_id', { ascending: false });

      if (foundError) {
        console.error('Found posts error:', foundError);
        setError(foundError.message);
        return;
      }

      setLostPosts(lostData || []);
      setFoundPosts(foundData || []);
    } catch (err) {
      console.error('Load posts crash:', err);
      setError('Could not load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel('public-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lost_items'
        },
        () => {
          loadPosts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Found_Items'
        },
        () => {
          loadPosts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Items'
        },
        () => {
          loadPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2 className="page-title">Campus Posts</h2>
        <p style={{ color: '#ccc' }}>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">Campus Lost & Found Posts</h2>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3 style={{ color: '#c8102e', marginBottom: '1rem' }}>
          Lost Items
        </h3>

        {lostPosts.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px' }}>
            No lost items have been posted yet.
          </p>
        ) : (
          lostPosts.map((post) => (
            <div key={post.lost_item_id} className="match-card">
              <p>
                Lost Item ID:{' '}
                <span>{post.lost_item_id}</span>
              </p>
              <p>
                Item:{' '}
                <span>{post.Items?.Item_Names?.name || 'Unknown'}</span>
              </p>
              <p>
                Color:{' '}
                <span>{post.Items?.Colors?.color || 'Unknown'}</span>
              </p>
              <p>
                Location:{' '}
                <span>{post.Items?.Locations?.location || 'Unknown'}</span>
              </p>
              <p>
                Status:{' '}
                <span>{post.status}</span>
              </p>
              <p>
                Posted:{' '}
                <span>
                  {post.Items?.created_at
                    ? new Date(post.Items.created_at).toLocaleString()
                    : 'Unknown'}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3 style={{ color: '#c8102e', marginBottom: '1rem' }}>
          Found Items
        </h3>

        {foundPosts.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px' }}>
            No found items have been posted yet.
          </p>
        ) : (
          foundPosts.map((post) => (
            <div key={post.found_item_id} className="match-card">
              <p>
                Found Item ID:{' '}
                <span>{post.found_item_id}</span>
              </p>
              <p>
                Item:{' '}
                <span>{post.Items?.Item_Names?.name || 'Unknown'}</span>
              </p>
              <p>
                Color:{' '}
                <span>{post.Items?.Colors?.color || 'Unknown'}</span>
              </p>
              <p>
                Location:{' '}
                <span>{post.Items?.Locations?.location || 'Unknown'}</span>
              </p>
              <p>
                Status:{' '}
                <span>{post.status}</span>
              </p>
              <p>
                Posted:{' '}
                <span>
                  {post.Items?.created_at
                    ? new Date(post.Items.created_at).toLocaleString()
                    : 'Unknown'}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewPosts;
